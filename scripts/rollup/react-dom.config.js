import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from "./utils";
import generatePackage from "rollup-plugin-generate-package-json";
import alias from "@rollup/plugin-alias";

const { name, module, peerDependencies } = getPackageJSON("react-dom");
const pkgPath = resolvePkgPath(name);
const pkgDiskPath = resolvePkgPath(name, true);

export default [
  // react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDiskPath}/index.js`,
        name: "index.js",
        format: "umd",
      },
      {
        file: `${pkgDiskPath}/client.js`,
        name: "client.js",
        format: "umd",
      },
    ],
    external: [...Object.keys(peerDependencies)],
    plugins: [
      ...getBaseRollupPlugins(),
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/histConfig.ts`,
        },
      }),
      generatePackage({
        inputFolder: pkgPath,
        outputFolder: pkgDiskPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: "index.js",
          peerDependencies: {
            react: version,
          },
        }),
      }),
    ],
  },
];
