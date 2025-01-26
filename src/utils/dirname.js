import path from 'path';
import { fileURLToPath } from 'url';

const pathFile = fileURLToPath(import.meta.url);
const pathUtils = path.dirname(pathFile);
const __dirname = path.resolve(pathUtils, "../../");

export default __dirname;