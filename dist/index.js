"use strict";
const utils_1 = require("@typescript-eslint/utils");
const DESCRIPTION = 'Enforce component props types to be defined and imported from a separate file (e.g., Component.types.ts) instead of inline.';
const MESSAGE = 'Component props type must be defined as a named type (e.g., `Props`) and should be imported or defined externally';
const createRule = utils_1.ESLintUtils.RuleCreator((name) => 'none');
const rule = createRule({
    name: 'no-inline-props',
    defaultOptions: [],
    meta: {
        type: 'suggestion',
        schema: [],
        docs: {
            description: DESCRIPTION,
        },
        messages: {
            noInlineProps: MESSAGE
        },
    },
    create: (context) => {
        const checkRule = (node) => {
            const propsParam = node.params[0];
            if (!propsParam) {
                return;
            }
            if ("typeAnnotation" in propsParam && propsParam.typeAnnotation) {
                const typeAnnotation = propsParam.typeAnnotation.typeAnnotation;
                if (typeAnnotation.type === utils_1.AST_NODE_TYPES.TSTypeLiteral) {
                    context.report({
                        node: propsParam.typeAnnotation,
                        messageId: 'noInlineProps',
                    });
                    return;
                }
                if (propsParam.type === utils_1.AST_NODE_TYPES.ObjectPattern && propsParam.typeAnnotation) {
                    const typeAnnotation = propsParam.typeAnnotation.typeAnnotation;
                    if (typeAnnotation.type === utils_1.AST_NODE_TYPES.TSTypeLiteral) {
                        context.report({
                            node: propsParam.typeAnnotation,
                            messageId: 'noInlineProps',
                        });
                    }
                }
            }
        };
        return {
            'ArrowFunctionExpression,FunctionDeclaration': (node) => {
                checkRule(node);
            },
        };
    }
});
const plugin = {
    configs: {
        recommended: {
            files: ["**/*.ts", "**/*.tsx"],
            plugins: {
                'inline-props-linter': {
                    rules: {
                        'no-inline-props': rule,
                    },
                },
            },
            rules: {
                'inline-props-linter/no-inline-props': 'error',
            },
        },
    },
};
module.exports = plugin;
