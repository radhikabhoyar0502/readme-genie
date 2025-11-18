import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import * as babel from '@babel/parser';
import traverse from '@babel/traverse';

function extractJSDocComment(node) {
  if (node.leadingComments && node.leadingComments.length > 0) {
    const comment = node.leadingComments[node.leadingComments.length - 1];
    if (comment.type === 'CommentBlock' && comment.value.startsWith('*')) {
      return comment.value.trim();
    }
  }
  return null;
}

function extractPropsFromParams(params, interfacesMap = {}, typeAliasMap = {}) {
  const props = [];
  if (params.length === 0) return props;

  const firstParam = params[0];

  // Destructured props: ({ prop1, prop2 }: MyInterface) OR ({ prop1, prop2 })
  if (firstParam.type === 'ObjectPattern') {
    // ALWAYS extract from the actual destructured parameters first
    // This is the source of truth for what props the component actually accepts
    // Interfaces may use complex TypeScript utility types (Omit, Pick, etc.) that can't be fully resolved
    console.log('🔍 Processing ObjectPattern with', firstParam.properties?.length || 0, 'properties');
    if (firstParam.properties && firstParam.properties.length > 0) {
      firstParam.properties.forEach((prop, idx) => {
        console.log(`  [${idx}] type=${prop.type}, key=${prop.key?.name || '(no name)'}`);
        if (prop.type === 'ObjectProperty' || prop.type === 'Property') {
          const propName = prop.key?.name || 'unknown';
          let propType = 'any';
          let required = true;

          // Check for TypeScript type annotation on the destructured prop
          if (prop.value && prop.value.typeAnnotation) {
            propType = extractTypeAnnotation(prop.value.typeAnnotation.typeAnnotation);
          }

          // Check if prop has a default value (means it's optional)
          if (prop.value && prop.value.type === 'AssignmentPattern') {
            required = false;
            // Get the type from the left side if available
            if (prop.value.left && prop.value.left.typeAnnotation) {
              propType = extractTypeAnnotation(prop.value.left.typeAnnotation.typeAnnotation);
            }
          }

          props.push({ name: propName, type: propType, required });
          console.log(`    ✅ Pushed: ${propName}`);
        }

        // Handle rest/spread properties  
        if (prop.type === 'RestElement') {
          const restName = prop.argument?.name || 'rest';
          props.push({ name: `...${restName}`, type: 'Spread props', required: false });
          console.log(`    ✅ Pushed rest: ...${restName}`);
        }
      });
    }
    
    console.log(`📊 Total props extracted: ${props.length}`);
    return props;
  }

  // Non-destructured parameter with TypeScript annotation: (props: MyProps)
  if (firstParam.type === 'Identifier' && firstParam.typeAnnotation && firstParam.typeAnnotation.typeAnnotation) {
    const typeAnnotation = firstParam.typeAnnotation.typeAnnotation;

    if (typeAnnotation.type === 'TSTypeReference' && typeAnnotation.typeName) {
      const interfaceName = typeAnnotation.typeName.name || typeAnnotation.typeName.right?.name;

      // If we found the interface, return its props
      if (interfaceName && (interfacesMap[interfaceName] || typeAliasMap[interfaceName])) {
        return interfacesMap[interfaceName] || typeAliasMap[interfaceName];
      }
    }
  }

  return props;
} function extractTypeAnnotation(typeAnnotation) {
  if (!typeAnnotation) return 'any';

  switch (typeAnnotation.type) {
    case 'TSStringKeyword':
      return 'string';
    case 'TSNumberKeyword':
      return 'number';
    case 'TSBooleanKeyword':
      return 'boolean';
    case 'TSArrayType':
      return `${extractTypeAnnotation(typeAnnotation.elementType)}[]`;
    case 'TSTypeReference':
      if (typeAnnotation.typeName) {
        return typeAnnotation.typeName.name || typeAnnotation.typeName.right?.name || 'any';
      }
      return 'any';
    case 'TSUnionType':
      return typeAnnotation.types.map(t => extractTypeAnnotation(t)).join(' | ');
    default:
      return 'any';
  }
}

function isReactComponent(node, content) {
  // Check if function returns JSX
  let hasJSXReturn = false;

  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
    // Check body for JSX
    if (node.body) {
      if (node.body.type === 'JSXElement' || node.body.type === 'JSXFragment') {
        hasJSXReturn = true;
      } else if (node.body.type === 'BlockStatement') {
        // Check return statements
        const checkForJSX = (body) => {
          if (body.type === 'ReturnStatement') {
            if (body.argument && (body.argument.type === 'JSXElement' || body.argument.type === 'JSXFragment')) {
              hasJSXReturn = true;
            }
          }
          if (body.body && Array.isArray(body.body)) {
            body.body.forEach(checkForJSX);
          }
        };
        if (node.body.body && Array.isArray(node.body.body)) {
          node.body.body.forEach(checkForJSX);
        }
      }
    }
  }

  return hasJSXReturn;
}

export async function analyzeProject(dir = '.') {
  // Ensure we're working with absolute path
  const absoluteDir = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);

  console.log(`📁 Scanning: ${absoluteDir}`);
  const paths = await globby(['**/*.{js,jsx,ts,tsx}'], {
    cwd: absoluteDir,
    gitignore: true,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**']
  });

  console.log(`📄 Files found: ${paths.length}`); const functions = [];
  const components = [];
  const interfacesMap = {};
  const typeAliasMap = {};

  for (const file of paths) {
    const content = fs.readFileSync(file, 'utf8');
    let ast;
    try {
      ast = babel.parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy'],
        attachComment: true,
      });
    } catch (err) {
      console.warn(`Failed to parse ${file}:`, err.message);
      continue;
    }

    // First pass: Collect TypeScript interfaces and type aliases
    try {
      traverse.default(ast, {
        TSInterfaceDeclaration({ node }) {
          try {
            const interfaceName = node.id.name;
            const props = node.body.body.map(prop => {
              const propName = prop.key?.name || 'unknown';
              const propType = prop.typeAnnotation ? extractTypeAnnotation(prop.typeAnnotation.typeAnnotation) : 'any';
              const required = !prop.optional;
              return { name: propName, type: propType, required };
            });
            interfacesMap[interfaceName] = props;
          } catch (err) {
            console.warn(`Failed to parse interface in ${file}:`, err.message);
          }
        },
        TSTypeAliasDeclaration({ node }) {
          try {
            const aliasName = node.id.name;
            if (node.typeAnnotation.type === 'TSTypeLiteral') {
              const props = node.typeAnnotation.members.map(prop => {
                const propName = prop.key?.name || 'unknown';
                const propType = prop.typeAnnotation ? extractTypeAnnotation(prop.typeAnnotation.typeAnnotation) : 'any';
                const required = !prop.optional;
                return { name: propName, type: propType, required };
              });
              typeAliasMap[aliasName] = props;
            }
          } catch (err) {
            console.warn(`Failed to parse type alias in ${file}:`, err.message);
          }
        }
      });
    } catch (err) {
      console.warn(`Failed first traversal of ${file}:`, err.message);
    }

    // Second pass: Detect components and functions
    try {
      traverse.default(ast, {
        // Function declarations: function MyComponent(props) {}
        FunctionDeclaration({ node }) {
          const isComponent = isReactComponent(node, content);
          const name = node.id?.name || 'anonymous';
          const jsdoc = extractJSDocComment(node);

          if (isComponent) {
            const props = extractPropsFromParams(node.params, interfacesMap, typeAliasMap);            // Check for TypeScript interface
            if (node.params[0] && node.params[0].typeAnnotation) {
              const typeRef = node.params[0].typeAnnotation.typeAnnotation;
              if (typeRef.type === 'TSTypeReference' && typeRef.typeName) {
                const interfaceName = typeRef.typeName.name || typeRef.typeName.right?.name;
                if (interfacesMap[interfaceName]) {
                  components.push({
                    name,
                    file: path.relative(absoluteDir, file),
                    props: interfacesMap[interfaceName],
                    description: jsdoc,
                    type: 'Function Component'
                  });
                  return;
                }
                if (typeAliasMap[interfaceName]) {
                  components.push({
                    name,
                    file: path.relative(absoluteDir, file),
                    props: typeAliasMap[interfaceName],
                    description: jsdoc,
                    type: 'Function Component'
                  });
                  return;
                }
              }
            }

            components.push({
              name,
              file: path.relative(absoluteDir, file),
              props: props.length > 0 ? props : [{ name: 'No props detected', type: '-', required: false }],
              description: jsdoc,
              type: 'Function Component'
            });
          } else {
            functions.push({
              name,
              file: path.relative(absoluteDir, file),
              params: node.params.map(p => {
                if (p.type === 'ObjectPattern') return '{...}';
                if (p.type === 'RestElement') return '...rest';
                if (p.type === 'AssignmentPattern') return p.left.name || 'param';
                return p.name || 'param';
              }).join(', '),
              description: jsdoc
            });
          }
        },

        // Variable declarations: const MyComponent = (props) => {}
        VariableDeclarator({ node, parent }) {
          const name = node.id.name;
          const jsdoc = extractJSDocComment(parent);

          // Arrow function or function expression
          if (node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
            const isComponent = isReactComponent(node.init, content);

            if (isComponent) {
              const props = extractPropsFromParams(node.init.params, interfacesMap, typeAliasMap);

              // Check for TypeScript annotation on variable
              if (node.id.typeAnnotation && node.id.typeAnnotation.typeAnnotation.type === 'TSTypeReference') {
                const typeName = node.id.typeAnnotation.typeAnnotation.typeName;

                // React.FC<PropsInterface>
                if (typeName && typeName.type === 'TSQualifiedName' && typeName.left?.name === 'React' && typeName.right?.name === 'FC') {
                  let propsInterface = null;
                  if (node.id.typeAnnotation.typeAnnotation.typeParameters &&
                    node.id.typeAnnotation.typeAnnotation.typeParameters.params.length > 0) {
                    const typeParam = node.id.typeAnnotation.typeAnnotation.typeParameters.params[0];
                    if (typeParam.type === 'TSTypeReference' && typeParam.typeName) {
                      propsInterface = typeParam.typeName.name || typeParam.typeName.right?.name;
                    }
                  }

                  const detectedProps = propsInterface && (interfacesMap[propsInterface] || typeAliasMap[propsInterface])
                    ? (interfacesMap[propsInterface] || typeAliasMap[propsInterface])
                    : props;

                  components.push({
                    name,
                    file: path.relative(absoluteDir, file),
                    props: detectedProps.length > 0 ? detectedProps : [{ name: 'No props detected', type: '-', required: false }],
                    description: jsdoc,
                    type: 'React.FC'
                  });
                  return;
                }
              }

              // Check params for TypeScript interface
              if (node.init.params[0] && node.init.params[0].typeAnnotation) {
                const typeRef = node.init.params[0].typeAnnotation.typeAnnotation;
                if (typeRef.type === 'TSTypeReference' && typeRef.typeName) {
                  const interfaceName = typeRef.typeName.name || typeRef.typeName.right?.name;
                  if (interfacesMap[interfaceName] || typeAliasMap[interfaceName]) {
                    components.push({
                      name,
                      file: path.relative(absoluteDir, file),
                      props: interfacesMap[interfaceName] || typeAliasMap[interfaceName],
                      description: jsdoc,
                      type: 'Arrow Function Component'
                    });
                    return;
                  }
                }
              }

              components.push({
                name,
                file: path.relative(absoluteDir, file),
                props: props.length > 0 ? props : [{ name: 'No props detected', type: '-', required: false }],
                description: jsdoc,
                type: 'Arrow Function Component'
              });
            }
          }
        },

        // Class components
        ClassDeclaration({ node }) {
          if (node.superClass && (node.superClass.name === 'Component' || node.superClass.name === 'PureComponent')) {
            const jsdoc = extractJSDocComment(node);
            const name = node.id.name;

            // Try to find props interface from superClass typeParameters
            let propsInterface = null;
            if (node.superClass.typeParameters && node.superClass.typeParameters.params.length > 0) {
              const typeParam = node.superClass.typeParameters.params[0];
              if (typeParam.type === 'TSTypeReference' && typeParam.typeName) {
                propsInterface = typeParam.typeName.name || typeParam.typeName.right?.name;
              }
            }

            const props = propsInterface && (interfacesMap[propsInterface] || typeAliasMap[propsInterface])
              ? (interfacesMap[propsInterface] || typeAliasMap[propsInterface])
              : [{ name: 'this.props', type: 'any', required: false }];

            components.push({
              name,
              file: path.relative(absoluteDir, file),
              props,
              description: jsdoc,
              type: 'Class Component'
            });
          }
        },

        // Export default (anonymous components)
        ExportDefaultDeclaration({ node }) {
          if (node.declaration) {
            if (node.declaration.type === 'FunctionDeclaration' ||
              node.declaration.type === 'ArrowFunctionExpression' ||
              node.declaration.type === 'FunctionExpression') {
              const isComponent = isReactComponent(node.declaration, content);
              if (isComponent && !node.declaration.id) {
                const fileName = path.basename(file, path.extname(file));
                const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
                const props = node.declaration.params ? extractPropsFromParams(node.declaration.params, interfacesMap, typeAliasMap) : []; components.push({
                  name: `${componentName} (default export)`,
                  file: path.relative(absoluteDir, file),
                  props: props.length > 0 ? props : [{ name: 'No props detected', type: '-', required: false }],
                  description: null,
                  type: 'Default Export Component'
                });
              }
            }
          }
        }
      });
    } catch (err) {
      console.warn(`Failed second traversal of ${file}:`, err.message);
    }
  }

  return { functions, components, interfacesMap, typeAliasMap };
}