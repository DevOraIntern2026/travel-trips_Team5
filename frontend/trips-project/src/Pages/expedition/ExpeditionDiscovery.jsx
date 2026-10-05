import { Link, } from "react-router-dom"
import homeIcon from "../../assets/images/expeditionImages/homeIcon.png"
import "./expeditionDiscovery.css"
import verify from "../../assets/images/expeditionImages/verify.png"
import destinationImage from "../../assets/images/expeditionImages/Icon.png"
import windowImage from "../../assets/images/expeditionImages/window.png"
import travelerImage from "../../assets/images/expeditionImages/traveler.png"
import searchIcon from "../../assets/images/expeditionImages/search.png"
import { useState } from "react"
export default function ExpeditionDiscovery() {
  const [count, setCount] = useState(0);

  return (
    <div className="ExpeditionContainer">

      <div className="path">
        <img src={homeIcon} alt="HomeIcon" />
        <Link to="/">Home</Link>
        <span className="rightArrow"> &gt;</span>
        <span> Expedition Discovery</span>
      </div>

      <div className="liveGlobalContainer">
        <div className="liveGlobalHeader">
          <div className="headerText">
            <span className="dot"></span>
            <p className="text">LIVE GLOBAL INVENTORY CURATION</p>
          </div>
          <div className="verificationContainer ">
            <img src={verify} alt="verify" />
            <p className="verifyText">15-Min Live Hold Engine Active</p>
          </div>
        </div>
        <div className="sacredWildernessContainer">
          <h1 className="text">Venture into Egypt's Sacred
            Wilderness & Deep Sahara
          </h1>
          <p className="descriptionWilderness">Direct operator allocations. Verified backcountry logistics. Instant lockouts with
            zero speculative wait times.
          </p>
        </div>
        <div className="hold">
          <div className="destinationContainer">
            <div className="destination">
              <div className="destinationWrapper">
                <img src={destinationImage} alt="Destination" />
                <p className="destinationText">Destination</p>
              </div>
              <select>
                <option>South Sinai, White Desert, or Siwa Oasis</option>
                <option>South Sinai, White Desert, or Siwa Oasis</option>
              </select>
            </div>
            <div className="windowContainer">
              <div className="window">
                <div className="windowWrapper">
                  <img src={windowImage} alt="Window" />
                  <p className="windowText">Window</p>
                </div>

              </div>
            </div>
            <div className="travelerContainer">
              <div className="traveler">
                <div className="travelerWrapper">
                  <img src={travelerImage} alt="Traveler" />
                  <p className="travelerText">Traveler</p>
                </div>
                <div className="explorers">
                  <p>{count} Explorers</p>
                </div>

              </div>
              <div className="travelerButtons">
                <button className="minus" onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
                <p>{count}</p>
                <button className="plus" onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
              </div>
            </div>
            <div className="searchButtonContainer">
              <img src={searchIcon} alt="Search" />
              <button className="searchButton">Find Expeditions</button>
            </div>

          </div>
          <div className="expeditionsTypesContainer">
            <div className="expeditionsTypes">
              <span className="expeditionsTypesText">TYPE:</span>
              <ul className="expeditionsTypesList">
                
                <li>Expedition</li>
                <li>Alpine Trek</li>
                <li>Coastal Safari</li>  
                <li>Cultural</li>
              </ul>
            </div>
          </div>

        </div>

        <div />
      </div>
    </div>
  )
}
