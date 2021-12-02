import moment from "moment";
import { useState } from "react";
import { challenge, characters, settings } from "../models/challenge";

import { useUrlStorage } from "./urlStorage.hook";

import "../styles/challengeGenerator.scss";

/**
 * Challenge generator component
 */
const ChallengeGenerator = () => {
  //#region state
  const [challenge, setChallenge] = useState<challenge>({
    character: "Batman",
    setting: "{character} is at an amusement park",
    weekStartDt: moment().startOf("day").toDate(),
    weekEndDt: moment().add(7, "days").endOf("day").toDate(),
  });
  //#endregion

  useUrlStorage(challenge, setChallenge, (value: string) => {
    const deserializedChallenge = JSON.parse(value) as challenge;
    if (deserializedChallenge.weekEndDt) deserializedChallenge.weekEndDt = new Date(deserializedChallenge.weekEndDt);
    if (deserializedChallenge.weekStartDt) deserializedChallenge.weekStartDt = new Date(deserializedChallenge.weekStartDt);
    return deserializedChallenge;
  });

  /**
   * on "generate" click handler
   * @param {any} e mouse click event
   */
  const onGenerateClick = (e: any) => {
    generateNewChallenge();
  };

  /**
   * generate new random challenge
   */
  const generateNewChallenge = () => {
    // pick a character at random
    const characterListLength = Object.keys(characters).length;
    const randomCharacter = characters[Math.floor(Math.random() * characterListLength)];

    // pick a random setting
    const settingListLength = Object.keys(settings).length;
    const randomSetting = settings[Math.floor(Math.random() * settingListLength)];

    const newChallenge: challenge = { ...challenge, character: randomCharacter, setting: randomSetting };
    setChallenge(newChallenge);
  };

  // extract character and setting
  const { character, setting, weekStartDt, weekEndDt } = challenge;

  /**
   * Renders stylized challenge text
   */
  const GeneratedText = () => {
    const characterHtml = `<span class="wdc-challenge-generator-character-text">${character}</span>`;
    return (
      <>
        <div
          className="wdc-challenge-generator-challenge-text"
          dangerouslySetInnerHTML={{ __html: setting?.replace("{character}", characterHtml) || "" }}
        />
      </>
    );
  };

  return (
    <div className="wdc-challenge-generator-container">
      <div className="wdc-challenge-generator-header">
        <h2>
          This week's challenge ({weekStartDt?.toLocaleDateString()} - {weekEndDt?.toLocaleDateString()})
        </h2>
      </div>
      <div className="wdc-challenge-generator-content">
        <div className="wdc-challenge-generator-generated-text">
          <GeneratedText />
        </div>
        <div className="wdc-challenge-generator-actions">
          <button className="wdc-challenge-generator-generate-btn" name="generate" onClick={onGenerateClick}>
            generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeGenerator;
