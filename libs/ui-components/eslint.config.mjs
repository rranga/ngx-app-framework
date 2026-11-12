import nx from "@nx/eslint-plugin";
import angular from "angular-eslint";
import baseConfig from "../../eslint.config.mjs";

export default [
    ...nx.configs["flat/angular"],
    ...nx.configs["flat/angular-template"],
    ...baseConfig,
    {
        files: [
            "**/*.json"
        ],
        rules: {
            "@nx/dependency-checks": [
                "error",
                {
                    ignoredFiles: [
                        "{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}"
                    ]
                }
            ]
        },
        languageOptions: {
            parser: await import("jsonc-eslint-parser")
        }
    },
    {
        files: [
            "**/*.ts"
        ],
        rules: {
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "ngx",
                    style: "camelCase"
                }
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "ngx",
                    style: "kebab-case"
                }
            ],
            // Library components must work in OnPush/zoneless applications.
            "@angular-eslint/prefer-on-push-component-change-detection": "error",
            "@angular-eslint/prefer-output-readonly": "error"
        }
    },
    // Accessibility is a release requirement for the component library.
    ...angular.configs.templateAccessibility.map((config) => ({
        ...config,
        files: ["**/*.html"]
    })),
    {
        files: [
            "**/*.html"
        ],
        rules: {}
    }
];
