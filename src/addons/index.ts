import { CallbacksCollection } from "../index";
import bold     from "./bold"; 
import tab      from "./tab";

const systemCallbacks: CallbacksCollection = { }

systemCallbacks['bold']  = bold;
systemCallbacks['tab']   = tab;

export default systemCallbacks;