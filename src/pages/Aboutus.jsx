import Aboutushero from "./Aboutussections/Aboutushero"
import PduAboutus from "./Aboutussections/PduAboutus"
import Manageaboutus from "./Aboutussections/Manageaboutus";
import Homefooter from "./../Homefooter"
import Coreteamabout from "./Aboutussections/Coreteamabout";
import JourneyTimeline from "./Aboutussections/JourneyTimeline";
import Wings from "./Aboutussections/Wings";

function Aboutus(){
  return(
    <>
    <Aboutushero/>
    <PduAboutus/>
    <JourneyTimeline/>
    <Manageaboutus/>
    <Wings/>
    <Coreteamabout/>
    <Homefooter/>
    </>
  )
}

export default Aboutus;
