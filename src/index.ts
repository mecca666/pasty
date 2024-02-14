import {program} from "commander";
import path from "node:path";
import * as fs from "fs";

class FileOperations {
    createEntity(name: string, templateName: string) {
        const nameComponents = name.split("/");
        let originalFileName = nameComponents.pop();
        let fileName = originalFileName;
        if (originalFileName) {
            fileName = this.camelCaseToPeriodSeparated(originalFileName);
        }
        const directoryPath = path.join(process.cwd(), ...nameComponents);
        this.createDirectory(directoryPath);
        const {templatePath, usePackageTemplate} = this.getTemplatePath(templateName);
        const fileSuffix = this.getFileSuffix(usePackageTemplate, templateName);
        this.readAndWriteFile(templatePath, directoryPath, fileName, fileSuffix, originalFileName!);
    }

    camelCaseToPeriodSeparated(str: string) {
        // Ensure the first letter is lower cased
        str = str.charAt(0).toLowerCase() + str.slice(1);

        // Add a period before each capital letter, then convert to lower case
        return str.replace(/([A-Z])/g, ".$1").toLowerCase();
    }

    createDirectory(directoryPath: string) {
        fs.mkdirSync(directoryPath, {recursive: true});
    }

    getTemplatePath(templateName: string) {
        let templatePath = path.join(process.cwd(), `${templateName}.template`);
        let usePackageTemplate = false;
        if (!fs.existsSync(templatePath)) {
            templatePath = path.join(__dirname, "..", "src", "templates", `${templateName}.template`);
            usePackageTemplate = true;
        }
        return {templatePath, usePackageTemplate};
    }

    readAndWriteFile(templatePath: string, directoryPath: string, fileName: string, fileSuffix: string, originalFileName: string) {
        fs.readFile(templatePath, "utf8", (err, data) => {
            if (err) {
                console.error(`Failed to read the template file at ${templatePath}`, err);
                return;
            }
            this.writeToFile(directoryPath, fileName, fileSuffix, data, originalFileName);
        });
    }

    writeToFile(directoryPath: string, fileName: string, fileSuffix: string, data: string, originalFileName: string) {
        const content = data.replace(/{{ name }}/g, originalFileName);
        const outputPath = path.join(directoryPath, `${fileName}${fileSuffix}.tsx`);
        fs.writeFile(outputPath, content, (writeErr) => {
            if (writeErr) {
                console.error("Failed to write to the file", writeErr);
            } else {
                console.log(`File created successfully: ${outputPath}`);
            }
        });
    }

    getFileSuffix(usePackageTemplate: boolean, templateName: string) {
        let fileSuffix = "";
        if (usePackageTemplate && ["view", "provider"].includes(templateName)) {
            fileSuffix = `.${templateName}`;
        }
        return fileSuffix;
    }
}

program
    .command("make:view <name>")
    .option("--template <template>", "Template to use", "view")
    .description(
        "Useful for generating React native views with a basic layout. You can also create your own"
    )
    .action((name, options) => {
        const fileOps = new FileOperations();
        fileOps.createEntity(name, options.template);
    });
program
    .command("make:provider <name>")
    .option("--template <template>", "Template to use", "provider")
    .description("Useful for generating Providers in React Native. Feel free to use your own")
    .action((name, options) => {
        const fileOps = new FileOperations();
        fileOps.createEntity(name, options.template);
    });

program.parse(process.argv);