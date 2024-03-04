import React from 'react';
import "./style.scss"
import edit from "../../assets/pictures/icon-edit.png"
import debug from '../../assets/pictures/icon-debug.svg'
import runTest from "../../assets/pictures/icon-runTest.svg"
import options from "../../assets/pictures/icon-options.svg"
import saveScript from "../../assets/pictures/icon-save.svg"

const CreateScript = () => {
  return (
    <div className="component-right">
        <div className="component-right__header">
        <div className="component-right__header__inputBox">
            <input
            type="text"
            name="nameScenario"
            id="nameScenario"
            className="nameScenario"
            placeholder="Enter name here"
            />

            <img src={edit} alt="icon-edit" />
        </div>
        <div className="component-right__header__function">
            <img src={debug} alt="icon-debug" />
            <img src={runTest} alt="icon-run" />
            <img src={options} alt="icon-option" />
            <button type="submit" className="btnSave">
                <img src={saveScript} alt="icon-save" />
                <span>Save</span>
            </button>
        </div>
        </div>
        <div className="component-right__content"></div>
    </div>
  )
}

export default CreateScript