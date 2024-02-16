# React Native File Generator 🥟
React Native File Generator is a template generator designed specifically for React Native developers. It helps make your workflow more efficient by automating the tedious task of manually creating new files for each of your components.

## 🚧 Under Construction 🚧
Please note that React Native File Generator is currently in its testing phase. While many of its features are functional, you may encounter occasional bugs or issues.

## Features 🚀
* Fast and efficient generation of React Native component templates.
* Simple, customizable configuration.
* Ability to use custom templates.
* Free up more time for actual development work!

## Installation 💾
To start using React Native File Generator, follow these installation instructions:

1. Run `yarn add --dev react-native-file-generator`. We recommend using React Native File Generator as a development dependency, which is why we're using the `--dev` option.

## Usage 🎮
After installation, you can generate new files using one of the following commands:

1. To generate a new view file: `rnfg make:view ViewName` (will generate a file `view.name.view.tsx`)
2. To generate a new provider file: `rnfg make:provider Auth` (will generate a file `auth.provider.tsx`)

React Native File Generator isn't limited to the default templates. You can create a `templates` folder in the root directory of your project and add your own templates. Each custom template should follow a naming convention and end with `.template`. For example, `component.template` or `helper.template`.

## Reporting Issues 🐛
We appreciate your patience and assistance while we're in the testing phase. If you encounter any bugs or issues, please report them on our [issues page](url_to_your_project_issues_page).

## Contributing 💪
Interested in helping improve React Native File Generator? We welcome contributions from developers of all skill levels. For more details, see our [contributing guidelines](url_to_your_contributing_guidelines_page).

## License 📄
Distributed under the MIT License. See `LICENSE` for more information.

We hope React Native File Generator helps streamline your React Native workflow. Happy coding! 🎉