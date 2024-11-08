{
  "presets": ["next/babel"],
  "plugins": [
    ["styled-components", { "ssr": true, "displayName": true, "preprocess": false }],
    ["module-resolver", {
      "root": ["./"],
      "alias": {
        "@components": "./components",
        "@contexts": "./contexts",
        "@services": "./services",
        "@styles": "./styles",
        "@utils": "./utils"
      }
    }]
  ]
}