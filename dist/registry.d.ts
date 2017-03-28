import Lifestyle from "./lifestyle";
interface Registry {
    register(key: string, component: Function, lifestyle: Lifestyle): Registry;
}
export default Registry;
