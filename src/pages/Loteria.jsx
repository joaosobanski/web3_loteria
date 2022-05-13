import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Button } from "../Components/Button/Button";
import Header from "../Components/Header/Header";
import { Label } from "../Components/Label/Label";
import PlaceHolder from "../Components/Welcomepage/PlaceHolder";
import loteriaAbi from "../Contracts/loteria.json";
import classes from "./Loteria.module.css";

export const Loteria = ({}) => {
  const [chainId, setChainId] = useState("");
  const [address, setAddress] = useState("");
  const [valorAposta, setValorAposta] = useState("");
  const [valorTotalAposta, setTotalAposta] = useState("");
  const [providerLoteria, setProviderLoteria] = useState("");
  const [loteriaContrato, setLoteriaContrato] = useState("");
  const [donoDaBanca, setDonoDaBanca] = useState("");

  useEffect(() => {
    if (!address) {
      createProvider();
    }
    if (!valorAposta) {
      if (loteriaContrato) {
        handlePegarValorAposta();
        handleApostaGanhador();
        handleTotalAposta();
        handleDonoDaBanca();
      }
    }
  }, [address]);

  const createProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProviderLoteria(provider);
    const signer = await provider.getSigner();
    const contrato = new ethers.Contract(
      "0xD12A8A604Fd01A1BEC933f348521628A75c7299e",
      loteriaAbi,
      signer
    );
    setLoteriaContrato(contrato);
  };

  const handleConectar = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setAddress(result[0]);
        })
        .catch((error) => {
          alert(error.message);
        });

      const chainId_ = await window.ethereum.request({ method: "eth_chainId" });

      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4" }],
        })
        .then((e) => {
          setChainId(chainId_);
        });
    } else {
      console.log("Need to install MetaMask");
      alert("Please install MetaMask browser extension to interact");
    }
  };

  const handlePegarValorAposta = async () => {
    await loteriaContrato.aposta_valor().then((e) => {
      let valor = ethers.BigNumber.from(e.toHexString()).toNumber();
      setValorAposta(valor);
    });
  };

  const handleApostar = async () => {
    await loteriaContrato
      .apostar({ value: valorAposta })
      .then((e) => {
        alert("Você está participando do sorteio!");
      })
      .catch((er) => {
        console.log("aqui", er);
      });
  };

  const handleDonoDaBanca = async () => {
    await loteriaContrato.aposta_dono_banca().then((e) => {
      setDonoDaBanca(e);
    });
  };

  const handleApostaGanhador = async () => {
    await loteriaContrato.aposta_ganhador().then((e) => {
      if (e.toString().toUpperCase() == address.toString().toUpperCase())
        alert("voce foi o vencedor da ultima loteria!");
    });
  };

  const handleTotalAposta = async () => {
    await loteriaContrato.aposta_total().then((e) => {
      let valor = ethers.BigNumber.from(e.toHexString()).toNumber();
      setTotalAposta(valor);
    });
  };

  return (
    <div className={classes.wrapper}>
      <Header isLogged={address} connectWallet={handleConectar} />
      {!address ? (
        <PlaceHolder />
      ) : (
        <div className={classes["content"]}>
          <div className={classes.holder}>
            <section className={classes.description}>
              <h3>
                <Label text={`Valor Aposta: ${valorAposta}`} />
              </h3>
              <div>
                <Label text={`Valor Total Recompensa: ${valorTotalAposta}`} />
              </div>
              <div>
                <Label text={`Dono Da Banca: ${donoDaBanca}`} />
              </div>
            </section>
            <div className={classes["button-container"]}>
              <Button text='Apostar' handleClick={handleApostar} />
              <Button text='Dono da Banca' handleClick={handleDonoDaBanca} />
              <Button
                text='Aposta ganhador'
                handleClick={handleApostaGanhador}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
