import "./Aboutushero.css";
import greenarrow from "../../assets/greenarrow.png";
import purplearrow from "../../assets/purplearrow.png";
import redarrow from "../../assets/redarrow.png";
import yellowarrow from "../../assets/yellowarrow.png";

function Aboutushero(){
    return(
        <>
            <section className="aboutus-blacksection">
                <div className="greenarrow">
                    <img src={greenarrow} alt="about section" />
                </div>
                 <div className="purplearrow">
                    <img src={purplearrow} alt="about section" />
                </div>
                <div className="redarrow">
                    <img src={redarrow} alt="about section" />
                </div>
                <div className="yellowarrow">
                    <img src={yellowarrow} alt="about section" />
                </div>
                <div className="h1-wrapper">
                    <h1 className="reveal fade-up">ABOUT US</h1>
                </div>
            </section>
        </>
    );
}

export default Aboutushero;