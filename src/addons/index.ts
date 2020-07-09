import { CallbacksCollection }  from "..";
import bold                     from "./bold"; 
import tab                      from "./tab";
import lineNumber               from "./lineNumber";
import length                   from "./length";

const systemCallbacks: CallbacksCollection = { }

systemCallbacks['bold']         = bold;
systemCallbacks['tab']          = tab;
systemCallbacks['lineNumber']   = lineNumber;
systemCallbacks['length']       = length;

export default systemCallbacks;