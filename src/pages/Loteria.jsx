import { ethers, utils } from "ethers";

import React, { useEffect, useState } from "react";
import { Button } from "../Components/Button/Button";
import Header from "../Components/Header/Header";
import { Label } from "../Components/Label/Label";
import { Table } from "../Components/Table/Table";
import Loading from "../Components/Modal/Loading";
import PlaceHolder from "../Components/Welcomepage/PlaceHolder";
import loteriaAbi from "../Contracts/loteria.json";
import classes from "./Loteria.module.css";

export const Loteria = ({}) => {
  const [load, setLoad] = useState(false);
  const [chainId, setChainId] = useState("");
  const [address, setAddress] = useState("");
  const [valorAposta, setValorAposta] = useState("");
  const [valorTotalAposta, setTotalAposta] = useState("");
  const [providerLoteria, setProviderLoteria] = useState("");
  const [loteriaContrato, setLoteriaContrato] = useState("");
  const [donoDaBanca, setDonoDaBanca] = useState("");
  const [apostadores, setApostadores] = useState([]);

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
        handleApostadores();
      }
    }
  }, [address, valorTotalAposta, apostadores, load]);

  const createProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProviderLoteria(provider);
    const signer = await provider.getSigner();
    const contrato = new ethers.Contract(
      "0xb2F0BE0AC9CF9eC33e05C8F1FBB486020396D3f5",
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
    await loteriaContrato.apostaValor().then((e) => {
      let valor = ethers.BigNumber.from(e.toHexString()).toNumber();
      setValorAposta(valor);
    });
  };

  const handleApostar = async () => {
    setLoad(true);
    try {
      const txn = await loteriaContrato
        .apostar({ value: valorAposta })
        .catch((er) => {
          alert(er.error.message);
        });
      await txn.wait();
      handleApostadores();
      alert("Você está participando do sorteio!");
    } catch (er) {
      alert(er);
    } finally {
      setLoad(false);
    }
  };

  const handleDonoDaBanca = async () => {
    await loteriaContrato.apostaDonoBanca().then((e) => {
      setDonoDaBanca(e);
    });
  };

  const handleApostaGanhador = async () => {
    await loteriaContrato.apostaGanhador().then((e) => {
      if (e.toString().toUpperCase() == address.toString().toUpperCase())
        alert("voce foi o vencedor da ultima loteria!");
    });
  };

  const handleTotalAposta = async () => {
    await loteriaContrato.apostaTotal().then((e) => {
      setTotalAposta(e);
    });
  };

  const handleApostadores = async () => {
    await loteriaContrato.apostadores().then((e) => {
      setApostadores(e);
    });
  };

  const covertEth = (wei) => {
    const etherValor = utils.formatUnits(wei.toHexString(), "ether");
    return etherValor;
  }

  return (
    <div className={classes.wrapper}>
      {load && <Loading />}
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
              {load && <Button text="Loading" />}
              <Button text="Apostar" handleClick={handleApostar} />
              <Button text="Dono da Banca" handleClick={handleDonoDaBanca} />
              <Button
                text="Aposta ganhador"
                handleClick={handleApostaGanhador}
              />
            </div>
          </div>

          <div>
            <h1>Apostadores</h1>
            <Table
              apostadoresData={apostadores}

            />
          </div>
        </div>
      )}
    </div>
  );
};
