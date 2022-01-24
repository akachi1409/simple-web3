import React, { useEffect, useState } from "react";
import { Container, Row, Col, ProgressBar} from "react-bootstrap";

//import Assets
import { BsFileMinusFill, BsFilePlusFill } from 'react-icons/bs';

//import CSS
import './mint.css';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";

import Logo from "../../assets/bapc-logo-copy.png"
function Mint(){
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [feedback, setFeedback] = useState("");
    const [claimingNft, setClaimingNft] = useState(false);
    const [mintNum, setMintNum] = useState(0)
    const claimNFTs = (_amount) => {
        _amount = document.getElementById("inputBox").textContent;
        if (_amount <= 0) {
            return;
        }
        setFeedback("Minting your Official BooCrew NFT...");
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(_amount)
            // ********
            // You can change the line above to
            // .whiteListMint(blockchain.account, _amount) if you want only whitelisted
            // users to be able to mint through your website!
            // And after you're done with whitelisted users buying from your website,
            // You can switch it back to .mint(blockchain.account, _amount).
            // ********
            .send({
                from: blockchain.account,
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong. Check your transaction on Etherscan to find out what happened!");
                setClaimingNft(false);
            })
            .then((receipt) => {
                setFeedback(
                    "Your BooCrew NFT has been successfully minted!"
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
            });
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    const plus_num = () =>{
        // const {mintNum} = this.state;
        setMintNum(mintNum +1);
    }
    const minus_num = () =>{
        // const {mintNum} = this.state;
        if ( mintNum ==0)return;
        setMintNum(mintNum -1)
    }
    // console.log(data.totalSupply/data.maxSupply*100)
    return (
        <div className='mint-control' id='mint'>
            
            <div className='mint-background'>
            <div className='mint-overlay'></div>
                <div id="container">
                    <Row>
                        <Col md={12} xs={12} className='mint-description'>
                            
                            <a href="https://boredapepunkclub.io/"><img src={Logo} className="mint-logo-image"/></a>
                            <h1>MINT YOUR FREE PUNKED APE <br/> BELLOW</h1>
                            <p>
                                CONNECT YOUR WALLET AND PAY GAS TO CLAIM
                            </p>
                            {
                                data.maxSupply===0 ?
                                <ProgressBar  variant="success" now={0}  symbol={0} className='mint-progress'/>
                                :
                                <ProgressBar  variant="success" now={data.totalSupply/data.maxSupply*100}  symbol={data.totalSupply/data.maxSupply*100} className='mint-progress'/>
                            }
                            
                            <div className='number-control'>
                                <BsFileMinusFill color='white' size={40} onClick = {()=> minus_num()}/>
                                <span id = "inputBox">{mintNum}</span>
                                <BsFilePlusFill color='white' size={40} onClick = {() => plus_num()}/>
                            </div>
                            {
                            blockchain.account === "" || blockchain.smartContract === null ? 
                            <div className="flex-column">
                            <button className='ybutton' 
                            onClick={(e) => {
                                console.log("--------")
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                            }}>Connect</button>
                            {blockchain.errorMsg !== "" ? (
                                <span style={{ textAlign: "center", fontSize: 12, color: "white"}}>
                                        {blockchain.errorMsg}
                                    </span>
                                
                            ) : null}
                            </div>
                            :
                            <button className='ybutton'
                            onClick={(e) => {
                                e.preventDefault();
                                claimNFTs(10);
                                getData();
                            }}>{claimingNft ? "BUSY" : "MINT"}</button>
                        }
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Mint;