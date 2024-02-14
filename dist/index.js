#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var node_path_1 = __importDefault(require("node:path"));
var fs = __importStar(require("fs"));
var FileOperations = /** @class */ (function () {
    function FileOperations() {
    }
    FileOperations.prototype.createEntity = function (name, templateName) {
        var nameComponents = name.split("/");
        var originalFileName = nameComponents.pop();
        var fileName = originalFileName;
        if (originalFileName) {
            fileName = this.camelCaseToPeriodSeparated(originalFileName);
        }
        var directoryPath = node_path_1.default.join.apply(node_path_1.default, __spreadArray([process.cwd()], nameComponents, false));
        this.createDirectory(directoryPath);
        var _a = this.getTemplatePath(templateName), templatePath = _a.templatePath, usePackageTemplate = _a.usePackageTemplate;
        var fileSuffix = this.getFileSuffix(usePackageTemplate, templateName);
        this.readAndWriteFile(templatePath, directoryPath, fileName, fileSuffix, originalFileName);
    };
    FileOperations.prototype.camelCaseToPeriodSeparated = function (str) {
        // Ensure the first letter is lower cased
        str = str.charAt(0).toLowerCase() + str.slice(1);
        // Add a period before each capital letter, then convert to lower case
        return str.replace(/([A-Z])/g, ".$1").toLowerCase();
    };
    FileOperations.prototype.createDirectory = function (directoryPath) {
        fs.mkdirSync(directoryPath, { recursive: true });
    };
    FileOperations.prototype.getTemplatePath = function (templateName) {
        var templatePath = node_path_1.default.join(process.cwd(), "".concat(templateName, ".template"));
        var usePackageTemplate = false;
        if (!fs.existsSync(templatePath)) {
            templatePath = node_path_1.default.join(__dirname, "..", "src", "templates", "".concat(templateName, ".template"));
            usePackageTemplate = true;
        }
        return { templatePath: templatePath, usePackageTemplate: usePackageTemplate };
    };
    FileOperations.prototype.readAndWriteFile = function (templatePath, directoryPath, fileName, fileSuffix, originalFileName) {
        var _this = this;
        fs.readFile(templatePath, "utf8", function (err, data) {
            if (err) {
                console.error("Failed to read the template file at ".concat(templatePath), err);
                return;
            }
            _this.writeToFile(directoryPath, fileName, fileSuffix, data, originalFileName);
        });
    };
    FileOperations.prototype.writeToFile = function (directoryPath, fileName, fileSuffix, data, originalFileName) {
        var content = data.replace(/{{ name }}/g, originalFileName);
        var outputPath = node_path_1.default.join(directoryPath, "".concat(fileName).concat(fileSuffix, ".tsx"));
        fs.writeFile(outputPath, content, function (writeErr) {
            if (writeErr) {
                console.error("Failed to write to the file", writeErr);
            }
            else {
                console.log("File created successfully: ".concat(outputPath));
            }
        });
    };
    FileOperations.prototype.getFileSuffix = function (usePackageTemplate, templateName) {
        var fileSuffix = "";
        if (usePackageTemplate && ["view", "provider"].includes(templateName)) {
            fileSuffix = ".".concat(templateName);
        }
        return fileSuffix;
    };
    return FileOperations;
}());
commander_1.program
    .command("make:view <name>")
    .option("--template <template>", "Template to use", "view")
    .description("Useful for generating React native views with a basic layout. You can also create your own")
    .action(function (name, options) {
    var fileOps = new FileOperations();
    fileOps.createEntity(name, options.template);
});
commander_1.program
    .command("make:provider <name>")
    .option("--template <template>", "Template to use", "provider")
    .description("Useful for generating Providers in React Native. Feel free to use your own")
    .action(function (name, options) {
    var fileOps = new FileOperations();
    fileOps.createEntity(name, options.template);
});
commander_1.program.parse(process.argv);
