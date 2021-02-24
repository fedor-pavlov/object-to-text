import { CallbacksCollection }  from "..";
import bold                     from "./bold"; 
import tab                      from "./tab";
import lineNumber               from "./lineNumber";
import sizeOf                   from "./sizeOf";
import join                     from "./join";
import yesno                    from "./yesno";
import round                    from "./round";

const systemCallbacks: CallbacksCollection = { }

systemCallbacks['bold']         = bold;
systemCallbacks['tab']          = tab;
systemCallbacks['sizeOf']       = sizeOf;
systemCallbacks['join']         = join;
systemCallbacks['yesno']        = yesno;
systemCallbacks['ifelse']       = yesno;
systemCallbacks['round']        = round;
systemCallbacks['lineNumber']   = lineNumber;

export default systemCallbacks;