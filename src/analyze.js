import fs from 'fs';
import path from 'path';
import {globby } from 'globby';
import * as babel from '@babel/parser';
import traverse from '@babel/traverse';

<<<<<<< Updated upstream
export async function analyzeProject(dir) {
  const paths = await globby([`${dir}/**/*.js`, `${dir}/**/*.ts`], {
=======
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
>>>>>>> Stashed changes
    gitignore: true,
  });

  const functions = [];

  for (const file of paths) {
    const content = fs.readFileSync(file, 'utf8');
    let ast;
    try {
      ast = babel.parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });
    } catch {
      continue;
    }

    traverse.default(ast, {
      FunctionDeclaration({ node }) {
        functions.push({
          name: node.id?.name || 'anonymous',
          file,
          params: node.params.map(p => p.name).join(', '),
        });
      },
    });
  }

  return { functions };
}
