import { CallbacksCollection }  from "..";
import bold                     from "./bold"; 
import tab                      from "./tab";
import lineNumber               from "./lineNumber";
import sizeOf                   from "./sizeOf";
import join                     from "./join";

const systemCallbacks: CallbacksCollection = { }

systemCallbacks['bold']         = bold;
systemCallbacks['tab']          = tab;
systemCallbacks['sizeOf']       = sizeOf;
systemCallbacks['join']         = join;
systemCallbacks['lineNumber']   = lineNumber;

export default systemCallbacks;