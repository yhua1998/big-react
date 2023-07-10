import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from './utils'
import generatePackage from 'rollup-plugin-generate-package-json'

const { name, module } = getPackageJSON('react')
const pkgPath = resolvePkgPath(name)
const pkgDiskPath = resolvePkgPath(name, true)

export default [
    // react
    {
        input: `${pkgPath}/${module}`,
        output: {
            file: `${pkgDiskPath}/index.js`,
            name: 'index.js',
            format: 'umd'
        },
        plugins: [...getBaseRollupPlugins(), generatePackage({
            inputFolder: pkgPath,
            outputFolder: pkgDiskPath,
            baseContents: ({ name, description, version }) => ({
                name,
                description,
                version,
                main:'index.js'
            })
        })]
    },
    // jsx-runtime
    {
        input: `${pkgPath}/src/jsx.ts`,
        output: [
            // jsx-runtime
            {
                file: `${pkgDiskPath}/jsx-runtime.js`,
                name: `jsx-runtime.js`,
                format: 'umd'
            },
            // jsx-dev-runtime
            {
                file: `${pkgDiskPath}/jsx-dev-runtime.js`,
                name: 'jsx-dev-runtime.js',
                format: 'umd'
            }
        ],
        plugins: getBaseRollupPlugins()
    }
]