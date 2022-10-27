/**
 * NEAR Example Level -- Get working Level Near
 */

import React from "react";
import * as fs from "fs";
import * as nearAPI from "near-api-js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CodeComponent from "../components/Code";
import Author from "../components/Author";
import MarkdownComponent from "../components/Markdown";
import * as actions from "../actions";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import { Link } from "react-router-dom";
import getlevelsdata from "../utils/getlevelsdata";
import { NEAR_NOMINATION_EXP } from "near-api-js/lib/utils/format";
import nearImage from "./nearLevel2.svg";

class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestedInstance: false,
      submittedIntance: false,
      dropwDownOpened: false,
    };
  }

  // execute React code when the component is already placed in the DOM
  async componentDidMount() {
    //////////////////////////////////////////////////////
    // initNEAR
    // Initializing connection to the NEAR node.
    const nearConnection = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
    });
    console.log("NearConnection:", nearConnection);

    // Needed to access wallet
    const walletConnection = new nearAPI.WalletConnection(nearConnection);

    console.log("WalletConnection:", walletConnection);

    // Sign in if not signed in
    if (!walletConnection.isSignedIn()) {
      signIn(walletConnection);
    }
    // Load in account data
    let currentUser;
    if (walletConnection.getAccountId()) {
      currentUser = {
        accountId: walletConnection.getAccountId(),
        balance: (await walletConnection.account().state()).amount,
      };
    }
    console.log("CurrentUser: ", currentUser);
    this.setState({
      nearConnection: nearConnection,
      walletConnection: walletConnection,
      currentUser: currentUser,
    });

    ////////////////////////////////////////////////////////
    // initContract

    const account = walletConnection.account();
    const accountId = walletConnection.getAccountId();
    const methodOptions = {
      // name of contract you're connecting to
      viewMethods: ["getMessages"], // view methods do not change state but usually return a value
      changeMethods: ["addMessage"], // change methods modify state
      sender: accountId, // account ID to initialize transactions
    };

    const contract = new nearAPI.Contract(
      account,
      "example-contract.testnet",
      methodOptions
    );
    console.log("Contract: ", contract);
    this.setState({ contract: contract });

    ///////////////////////////////////
    // addMessages
    // await contract.addMessage({
    //   text: "Hello World",
    // });
    // getMessages
    // const messages = await contract.getMessages();
  }

  // execute React code when the component is removed from the DOM
  componentWillUnmount() {
    // if (this.props.activateLevel) {
    //   this.props.deactivateLevel(this.props.activateLevel);
    // }
  }

  // execute React code when the component is updated
  componentDidUpdate() {
    // if (this.props.level.deployedAddress !== this.props.match.params.address) {
    //   this.props.activateLevel(this.props.match.params.address);
    // }
    var codeElement = document.getElementsByClassName("hljs")[0];
    var black = getComputedStyle(document.documentElement).getPropertyValue(
      "--black"
    );
    if (codeElement && codeElement.style.background !== black)
      codeElement.style.background = black;
  }

  render() {
    // const { requestedInstance, submittedIntance } = this.state;

    // const { level, levelCompleted } = this.props;

    // var [levelData, selectedLevel] = getlevelsdata(this.props, "levelPage");

    // if (!level) return null;
    // const showCode = levelCompleted || level.revealCode;
    // const showCompletedDescription =
    //   constants.SHOW_ALL_COMPLETE_DESCRIPTIONS || levelCompleted;

    // let description = null;
    // let language = localStorage.getItem("lang");
    // let strings = loadTranslations(language);

    // let isDescriptionMissingTranslation = false;

    // try {
    //   description = require(`../gamedata/${language}/descriptions/levels/${level.description}`);
    // } catch (e) {
    //   //FIX-ME: If language selected is english then "language" variable is null and not "en"
    //   if (language) isDescriptionMissingTranslation = true; // Only set it if language is not null (i.e. some language different from english)
    //   description = require(`../gamedata/en/descriptions/levels/${level.description}`);
    // }
    // let completedDescription = null;

    // let isCompleteDescriptionMissingTranslation = false;
    // if (showCompletedDescription && level.completedDescription) {
    //   try {
    //     completedDescription = require(`../gamedata/${language}/descriptions/levels/${level.completedDescription}`);
    //   } catch (e) {
    //     isCompleteDescriptionMissingTranslation = true;
    //     completedDescription = require(`../gamedata/en/descriptions/levels/${level.completedDescription}`);
    //   }
    // }

    // let poweredBy =
    //   level.poweredBy?.src && level.poweredBy?.href ? level.poweredBy : null;

    // let sourcesFile = null;
    // try {
    //   sourcesFile = require(`contracts/NearContracts/near-test.rs`);
    // } catch (e) {
    //   console.log(e);
    // }

    // const nextLevelId = findNextLevelId(this.props.level, this.props.levels);

    return (
      <div>
        <div className="lines"></div>
        <main>
          {/* {(isDescriptionMissingTranslation ||
            isCompleteDescriptionMissingTranslation) && (
            <div style={{ textAlign: "center" }}>
              <p>
                {strings.levelNotTranslated}
                <a href="https://github.com/openzeppelin/ethernaut#adding-new-languages">
                  {strings.contributeTranslation}
                </a>
              </p>
            </div>
          )} */}

          {/* Level Selector Dropdown NAV */}
          {/* <div className="level-selector-nav">
            <div className="dropdown-menu-bar">
              <p>{selectedLevel.  }</p>
              <p>{level.name}</p>

              <div className="dropdown-menu-bar-button">
                <button className="dropdown-button">
                  <i className="fa fa-caret-down"></i>
                </button>
              </div>
            </div>
            <div className="level-selector-dropdown-content">
              {levelData.map((level) => {
                return (
                  <Link
                    key={level.name}
                    to={`${constants.PATH_LEVEL_ROOT}${level.deployedAddress}`}
                  >
                    <div className="level-selector-dropdown-content-item">
                      <p key={level.name}>
                        {level.completed === true && (
                          <span className="label label-default">✔</span>
                        )}{" "}
                        {level.name}
                      </p>
                      <p key={level.difficulty}>{level.difficulty}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div> */}

          {/* IMAGE */}
          <section>
            <img alt="" className="level-tile level-img-view" src={nearImage} />
          </section>

          {/* TITLE + INFO */}
          {/* {poweredBy && (
             <div className="powered-by">
              <p>
                {strings.poweredBy}
                <a href={poweredBy.href}>
                  <img
                    className="custom-img"
                    alt=""
                    style={{ width: "80px", height: "80px" }}
                    src={poweredBy.src}
                  />
                </a>
              </p>
              <h2> </h2>
            </div>
          )} */}

          <section className="descriptors">
            <div className="boxes">
              {/* DESCRIPTION */}
              <MarkdownComponent target={"This is my description"} />
            </div>
          </section>

          <section className="descriptors source-code">
            {/* CODE */}
            <div>
              <CodeComponent
                target={require(`contracts/NearContracts/near-test.rs`)}
              />
            </div>
          </section>

          {/* BUTTONS */}
          <section className="descriptors button-sequence">
            <div>
              {/* SUBMIT */}
              <button
                type="button"
                disabled={true}
                className="button-actions"
                onClick={(evt) => {
                  console.log("submit");
                }}
              >
                Submit Instance
              </button>

              {/* CREATE */}
              <button
                type="button"
                className="button-actions"
                onClick={async (evt) => {
                  // https://docs.near.org/tools/near-api-js/quick-reference#call-contract
                  console.log("create");
                  debugger;
                  await this.state.contract.addMessage({
                    text: "Hello World",
                  });
                }}
              >
                Create Instance
              </button>
            </div>
          </section>

          <section className="descriptors">
            <div className="boxes">
              {/* AUTHOR */}
              <Author author={"Earl Potters"} />
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer
          className="footer"
          dangerouslySetInnerHTML={{
            __html:
              "developed with <span aria-hidden='true' class='fa fa-heart' style='color: red;'></span> and <span aria-hidden='true' class='fa fa-flash' style='color: yellow;'></span> by the <a href='https://openzeppelin.com'>NEARAUTS</a> team",
          }}
        ></footer>
      </div>
    );
  }
}

/////////////////////////////////////////////////////////////// HELPER FUNCTIONS ////////////////////////////////////////////////////////////////////////////////

async function initNear() {
  // Initializing connection to the NEAR node.
  const nearConnection = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
  });
  console.log("NearConnection:", nearConnection);

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(nearConnection);

  console.log("WalletConnection:", walletConnection);

  // Sign in if not signed in
  if (!walletConnection.isSignedIn()) {
    signIn(walletConnection);
  }
  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }
  console.log("CurrentUser: ", currentUser);
  this.setState({
    nearConnection: nearConnection,
    walletConnection: walletConnection,
    currentUser: currentUser,
  });
}

async function initContract() {}

async function signIn(walletConnection) {
  walletConnection.requestSignIn("contract-example.testnet", "Nearnauts");
}

////////////////////////// CONFIG //////////////////////////

/*

function getConfig() {
  let config = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "http://localhost:1234",
    // walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: "https://helper.testnet.near.org",
    contractName,
  };

  if (process.env.REACT_APP_ENV !== undefined) {
    config = {
      ...config,
      GAS: "300000000000000",
      DEFAULT_NEW_ACCOUNT_AMOUNT: "5",
      contractMethods: {
        changeMethods: [
          "new",
          "mint_token",
          "guest_mint",
          "nft_transfer",
          "set_price",
          "purchase",
          "withdraw",
        ],
        viewMethods: ["get_token_data", "get_num_tokens", "get_proceeds"],
      },
      accessKeyMethods: {
        changeMethods: ["guest_mint", "set_price", "withdraw"],
        viewMethods: [
          "get_token_data",
          "get_num_tokens",
          "get_proceeds",
          "get_pubkey_minted",
        ],
      },
    };
  }

  if (process.env.REACT_APP_ENV === "prod") {
    config = {
      ...config,
      networkId: "mainnet",
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      contractName: "near",
    };
  }

  return config;
}

*/

///////////////////////// END /////////////////////////////

function findNextLevelId(level, list) {
  for (let i = 0; i < list.length; i++) {
    const otherLevel = list[i];
    if (level.deployedAddress === otherLevel.deployedAddress) {
      if (i < list.length - 1) {
        return list[i + 1].deployedAddress;
      } else return list[0].deployedAddress;
    }
  }
}

// Redux state to props mapping
function mapStateToProps(state) {
  const level = state.gamedata.activeLevel;

  return {
    level: level,
    activeLevel: level,
    player: state.player,
    levels: state.gamedata.levels,
    levelCompleted:
      level && state.player.completedLevels[level.deployedAddress] > 0,
    levelEmitted:
      level && state.contracts.levels[level.deployedAddress] !== undefined,
  };
}

// Redux dispatch to props mapping
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      activateLevel: actions.activateLevel,
      deactivateLevel: actions.deactivateLevel,
      loadLevelInstance: actions.loadLevelInstance,
      submitLevelInstance: actions.submitLevelInstance,
    },
    dispatch
  );
}

// bind redux state and dispatch to props
export default connect(mapStateToProps, mapDispatchToProps)(Level);
