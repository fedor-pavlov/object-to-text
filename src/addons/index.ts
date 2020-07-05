import { CallbacksCollection }  from "..";
import bold                     from "./bold"; 
import tab                      from "./tab";
import lineNumber               from "./lineNumber";

const systemCallbacks: CallbacksCollection = { }

systemCallbacks['bold']         = bold;
systemCallbacks['tab']          = tab;
systemCallbacks['lineNumber']   = lineNumber;

export default systemCallbacks;