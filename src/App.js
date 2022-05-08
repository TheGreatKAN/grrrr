import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Web3 from "web3";


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #E48509;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 4px 0px -2px rgba(10, 10, 10, 0.4);
  -webkit-box-shadow: 0px 5px 0px -2px rgba(10, 10, 10, 0.5);
  -moz-box-shadow: 0px 5px 0px -2px rgba(10, 10, 10, 0.5);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #3B04A0;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 15px 0px -2px rgba(200, 200, 200, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(200, 200, 200, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(200, 200, 200, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 50%;
  align-self: flex-start;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const ResponsiveWrapperHeader = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-height: 80px;
  padding: 10px;
  background-color : #FFF5EA;
  @media (min-width: 767px) {
    flex-direction: row;
  }
  @media (max-width: 565px) {
    max-height: 220px;
  }
`;

export const StyledLogo = styled.img`
  display: inline;
  width: 60px;
  @media (max-width: 767px) {
    width: 60px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const LogoDiv = styled.div`
display: flex;
align-items: center;
justify-content: center;
align-content: center;
gap: 10%;
width: 300px;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px solid black;
  background-color: black;
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #CECECE;
  text-decoration: none;
  :hover {
    color: #FF8938;
  }
`;

export const StyledHR = styled.hr`
  border: 2px solid white;  
  background-color: white;
  border-radius: 2px;
  width: 400px;
  @media (max-width: 567px) {
    width: 250px;
  }
`;

export const WalletBox = styled.div`
  text-decoration: none;
  border-radius: 10px;
  border: 2px solid #F4B469;
  background-color: #FFFDF7;
  //padding: 10px;
  font-weight: bold;
  font-size: 15px;
  width: 180px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :hover {
    background-color: #FFF5EA;
  }
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [walletAddress, setAddress] = useState("Connect Wallet");
  const [claimingNft, setClaimingNft] = useState(false);
  const [StakeNFT, setStakeNFT] = useState(false);
  const [UnStakeNFT, setUnStakeNFT] = useState(false);
  const [UnStakeAllNFT, setUnStakeAllNFT] = useState(false);
  const [ClaimReward, setClaimReward] = useState(false);
  const [CheckReward, setCheckReward] = useState(false);
  const [CheckIDS, setCheckIDS] = useState(false);
  const [feedback, setFeedback] = useState(`Approve The Contract For Staking`);
  const [isApproved, setisApproved] = useState(false);
  const [StakeMSG, setMSG] = useState(null);
  const [UnStakeAllMSG, setUnStakeAllMSG] = useState(null);
  const [UnStakeMSG, setUnMSG] = useState(null);
  const [HavestMSG, setHarvestMSG] = useState(null);
  const [RewardMSG, setRewardMSG] = useState(null);
  const [CheckMSG, setCheckMSG] = useState(null);
  const [tokens, settokens] = useState(1);
  const tokensInputRef = useRef();
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });


  const Approve = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    setFeedback(`Approving your Staking...`);
    setClaimingNft(true);
    blockchain.smartToken.methods
    .setApprovalForAll(CONFIG.CONTRACT_ADDRESS, true)
    .send({
      to: CONFIG.TOKEN,
      from: blockchain.account,
    })


      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `You can Now Stake Your NFT`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };


  const Stake = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    console.log("Gas limit: ", totalGasLimit);
    setMSG(`Staking your ${CONFIG.SYMBOL} #${tokens}...`);
    setStakeNFT(true);
    blockchain.smartContract.methods
      .deposit([tokens])
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })

      .once("error", (err) => {
        console.log(err);
        setMSG("Sorry, Something Went Wrong");
        setStakeNFT(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setMSG(
          `You Succesfully Staked Your ${CONFIG.NFT_NAME} #${tokens}`
        );
        setStakeNFT(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const unstakeallnfts = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    setUnStakeAllMSG(`Unstaking All of your NFTs...`);
    setUnStakeAllNFT(true);
    blockchain.smartContract.methods
    .depositsOf(blockchain.account)
    .call({
      from: blockchain.account,
    })
    .then((receipt) => {
      console.log(receipt);
      setCheckMSG(
        `TokenID #${receipt}`
      );
      let TID = receipt;
      setCheckIDS(false);
      dispatch(fetchData(blockchain.account));
    
    blockchain.smartContract.methods
    .withdraw(TID)
    .send({
      to: CONFIG.CONTRACT_ADDRESS,
      from: blockchain.account,
    })
      .once("error", (err) => {
        console.log(err);
        setUnStakeAllMSG("Sorry, something went wrong please try again later.");
        setClaimReward(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setUnStakeAllMSG(
          `All of Your NFTS Unstaked`
        );
        setClaimReward(false);
        dispatch(fetchData(blockchain.account));
      });
    });
  };

  const UnStake = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    console.log("Gas limit: ", totalGasLimit);
    setUnMSG(`UnStaking your ${CONFIG.SYMBOL} #${tokens}...`);
    setUnStakeNFT(true);
    blockchain.smartContract.methods
      .withdraw([tokens])
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })

      .once("error", (err) => {
        console.log(err);
        setUnMSG("Sorry, you have reached your wallet limit");
        setUnStakeNFT(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setUnMSG(
          `You Succesfully UnStaked ${CONFIG.SYMBOL} #${tokens}`
        );
        setUnStakeNFT(false);
        dispatch(fetchData(blockchain.account));
      });
  };



  const Harvest = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    setHarvestMSG(`Claiming your Rewards...`);
    setClaimReward(true);
    blockchain.smartContract.methods
    .depositsOf(blockchain.account)
    .call({
      from: blockchain.account,
    })
    .then((receipt) => {
      console.log(receipt);
      setCheckMSG(
        `TokenID #${receipt}`
      );
      let TID = receipt;
      setCheckIDS(false);
      dispatch(fetchData(blockchain.account));
    
    blockchain.smartContract.methods
    .claimRewards(TID)
    .send({
      to: CONFIG.CONTRACT_ADDRESS,
      from: blockchain.account,
    })
      .once("error", (err) => {
        console.log(err);
        setHarvestMSG("Sorry, something went wrong please try again later.");
        setClaimReward(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setHarvestMSG(
          `Rewards Harvested`
        );
        setClaimReward(false);
        dispatch(fetchData(blockchain.account));
      });
    });
  };


  const RewardCheck = () => {
    setRewardMSG(`Checking your ${CONFIG.SYMBOL} #${tokens} Rewards...`);
    setCheckReward(true);
    blockchain.smartContract.methods
      .calculateRewards(blockchain.account, [tokens])
      .call({
        from: blockchain.account,
      })
      .then((receipt) => {
        console.log(receipt);
        let amount = Web3.utils.fromWei(receipt.toString(), "ether");
        let totalreward = amount.substring(0,6);
        setRewardMSG(
          `${totalreward} CHI Token`
        );
        setCheckReward(false);
        dispatch(fetchData(blockchain.account));
      });
      

  };

  const CheckNFTs = () => {
    setCheckMSG(`Checking your Staked Tokens...`);
    setCheckIDS(true);
    blockchain.smartContract.methods
      .depositsOf(blockchain.account)
      .call({
        from: blockchain.account,
      })
      .then((receipt) => {
        console.log(receipt);
        setCheckMSG(
          `TokenID #${receipt}`
        );
        setCheckIDS(false);
        dispatch(fetchData(blockchain.account));
      });
  };


  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      setAddress(blockchain.account.substring(0,4) + "..." + blockchain.account.substring(38,42));

      blockchain.smartContract.methods
      .depositsOf(blockchain.account)
      .call({
        from: blockchain.account,
      })
      .then((receipt) => {
        let TOTALS = receipt;
        setCheckMSG(
          `#${receipt}`
        );
        blockchain.smartContract.methods
        .calculateRewards(blockchain.account, TOTALS)
        .call({
          from: blockchain.account,
        })
        .then((receipt) => {
          console.log(receipt);
          let AllRewards = receipt[0];
          let totalrwd = (Web3.utils.fromWei(AllRewards.toString(), "ether").substring(0,6)) * TOTALS.length;
          setRewardMSG(
            `${totalrwd}`
          );
        });
      });


      blockchain.smartToken.methods
      .isApprovedForAll(blockchain.account, CONFIG.CONTRACT_ADDRESS)
      .call({
        to: CONFIG.TOKEN,
        from: blockchain.account,
      })
        .then((receipt) => {
          console.log(receipt);
          setisApproved(true);
        });

    }
  };


  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{backgroundColor: "var(--primary)"}}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
                <ResponsiveWrapperHeader>

<LogoDiv>
<a href="https://messycats.io/" target={"_blank"}>
  <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
</a>
</LogoDiv>

<s.Headerlinks>
  <s.StyledLink href="https://messycats.io/#about" target={"_blank"}>
    About Us
  </s.StyledLink >
  <s.StyledLink href="https://messycats.io/#faq" target={"_blank"}>
    Roadmap
    </s.StyledLink>
    <s.StyledLink href="https://messycats.io/#faq" target={"_blank"}>
    Faq
    </s.StyledLink>
    <s.StyledLink href="https://messycats.io/#team" target={"_blank"}>
    Team
    </s.StyledLink>

</s.Headerlinks>

<s.HeaderDiv>
  <a href="https://twitter.com/MessyCatsNFT" target={"_blank"}>
<s.Icons src="/config/images/twitter.svg" alt="twitter" />
</a>
<a href="https://discord.gg/KmfRPmVrd6" target={"_blank"}>
<s.Icons src="/config/images/discord.svg" alt="discord" />
</a>
<a href={CONFIG.MARKETPLACE_LINK} target={"_blank"}>
<s.Icons src="/config/images/opensea.svg" alt="opensea" />
</a>
</s.HeaderDiv>

<WalletBox
onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
              getData();
            }}>
  {blockchain.account !== "" ? (
  <>
  <s.TextSubTitle style={{fontSize: "1rem", color: "#0B0E27"}}>
    {walletAddress}
    </s.TextSubTitle>
  </>
  ) : null }
</WalletBox>
</ResponsiveWrapperHeader>
<s.SpacerLarge/>


        <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          fontSize: 20,
                        }}
                      >
                        Stake your NFT for Reward
                      </s.TextDescription>

        <s.SpacerSmall />


        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>


          <s.BOX
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "rgb(108 93 173 / 64%)",
              padding: 24,
              borderRadius: 24,
              boxShadow: "0px 10px 11px 2px rgba(0,0,0,0.7)",
              
            }}
          >
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT

                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                     <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"column"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          Approve();
                          getData();
                        }}
                      >
                        {claimingNft ? "Approving" : "Approve"}
                        
                      </StyledButton>
                      <s.SpacerSmall />
                      <StyledHR></StyledHR>
                    </s.Container>

                  </>
                )}
            <s.SpacerMedium />

            { blockchain.account === "" || blockchain.smartContract === null ? (
            <>
            </>
          ) : (
            <>
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                  </s.Container>
                ) : (
                  <>
                     <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Rewards Earned : {RewardMSG}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {UnStakeMSG} {StakeMSG} {HavestMSG} {UnStakeAllMSG}
                    </s.TextDescription>
                    <s.SpacerMedium />


                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <input style={{ width: 125, height: 25}}
                          onChange={ e => settokens(e.target.value)}
                          value={tokens}
                          placeholder="TokenID"
                          type="number"
                          min="1"
                          max="10000"
                          ref={tokensInputRef}
                        /> 
                    </s.Container>
                    <s.SpacerMedium />
                    <s.Container ai={"flex-start"} jc={"center"} fd={"row"}>
                    <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          Stake();
                          getData();
                          setUnMSG(null);
                          setHarvestMSG(null);
                          setUnStakeAllMSG(null);
                        }}
                      >
                        {StakeNFT ? "Staking..." : "Stake"}
                        
                      </StyledButton>
                      <s.SpacerSmall />
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          UnStake();
                          getData();
                          setMSG(null);
                          setHarvestMSG(null);
                          setUnStakeAllMSG(null);
                        }}
                      >
                        {UnStakeNFT ? "Unstaking" : "Unstake"}
                        
                      </StyledButton>
                      <s.SpacerSmall />
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          unstakeallnfts();
                          getData();
                          setMSG(null);
                          setHarvestMSG(null);
                        }}
                      >
                        {UnStakeAllNFT ? "Unstaking" : "UnstakeAll"}
                        
                      </StyledButton>
                      </s.Container>
                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"column"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          Harvest();
                          getData();
                          setUnMSG(null);
                          setMSG(null);
                        }}
                        style={{ width:200 }}
                      >
                        {ClaimReward ? "Claiming..." : "Claim Your Reward"}
                        
                      </StyledButton>
                      <s.SpacerMedium />
                    </s.Container>

                    <s.SpacerSmall />
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Your Staked NFT: {CheckMSG}
                    </s.TextDescription>
                    <s.SpacerXSmall/>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Total Staked NFT: {data.tokensStaked}
                    </s.TextDescription>
                    <s.SpacerXSmall/>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      <StyledLink href={CONFIG.SCAN_LINK}>
                        ETHERSCAN
                      </StyledLink>
                    </s.TextDescription>
                  </>
                )}
            <s.SpacerMedium />
          </>)}
          </s.BOX>
          <s.SpacerLarge />

        </ResponsiveWrapper>
        <s.SpacerMedium />

      </s.Container>
    </s.Screen>
  );
}

export default App;
