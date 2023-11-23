import { AssetExtended, Wallet } from "@meshsdk/core";
import {
  useAddress,
  useAssets,
  useLovelace,
  useNetwork,
  useWallet,
  useWalletList,
} from "@meshsdk/react";
import { useEffect, useState } from "react";

const Home = () => {
  const { connect, disconnect, connected } = useWallet();
  const wallets = useWalletList();
  const address = useAddress();
  const lovelace = useLovelace();
  const assets = useAssets();
  const network = useNetwork();

  //#region walletAttributes
  const emptyWalletAttributes = { icon: "", name: "", version: "" };
  const [walletAttributes, setWalletAttributes] = useState<Wallet>(
    () => emptyWalletAttributes
  );
  const resetWalletAttributes = () =>
    setWalletAttributes(() => emptyWalletAttributes);
  //#endregion

  //#region assetAttributes
  const emptyAssetAttributes = {
    unit: "",
    policyId: "",
    assetName: "",
    fingerprint: "",
    quantity: "",
  };
  const [assetAttributes, setAssetAttributes] = useState<AssetExtended>(
    () => emptyAssetAttributes
  );
  const resetAssetAttributes = () =>
    setAssetAttributes(() => emptyAssetAttributes);
  //#endregion

  const handleWalletConnection = async (wallet: Wallet) => {
    console.log(`${wallet.name} Clicked!`);
    setWalletAttributes(() => wallet);
    try {
      await connect(wallet.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Wallet list:", wallets);
  }, [wallets]);

  useEffect(() => {
    console.log("Status connect:", connected);
  }, [connected]);

  return (
    <>
      {!connected ? (
        <div className="flex justify-center items-center h-screen bg-black text-white">
          <div className="border border-white rounded-3xl px-16 py-4">
            <h1 className="text-center text-2xl font-bold">Wallet List :</h1>
            <div className="flex justify-center items-center">
              {wallets.map((wallet, i) => (
                <div key={i}>
                  <div
                    className="flex items-center justify-center"
                    onClick={() => handleWalletConnection(wallet)}
                  >
                    <div className="border border-black bg-gray-700 rounded-xl mx-2 my-4 p-3 hover:border hover:border-white text-center">
                      <img src={wallet.icon} style={{ width: "48px" }} />
                      <b>{wallet.name}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-black text-white h-screen flex justify-center items-center">
          <div className="border border-white rounded-3xl px-16 py-4">
            <h1 className="text-center text-2xl font-bold">Wallet Detail :</h1>
            <div className="flex justify-center item-center">
              <div className="text-center">
                <div className=" bg-gray-700 rounded-xl mx-2 mt-4 mb-1 p-3">
                  <img src={walletAttributes.icon} style={{ width: "48px" }} />
                  <b>v {walletAttributes.version}</b>
                </div>
                <p className="font-semibold">
                  {network === 0 ? "Preprod" : "Mainnet"}
                </p>
              </div>
              <div className="mt-4 ml-4">
                <div className="flex mb-3">
                  <div className="w-28 font-bold py-1">Address</div>
                  <div className="bg-gray-600 rounded-sm px-4 py-1 w-228">
                    {address}
                  </div>
                </div>
                <div className="flex mb-3">
                  <div className="w-28 font-bold py-1">Balance</div>
                  <div className="bg-gray-600 rounded-sm px-4 py-1 w-56">
                    {lovelace} Lovelace
                  </div>
                </div>
                <div className="flex mb-3">
                  <div className="w-28 font-bold py-1">Token List</div>
                  <select
                    className="bg-gray-600 rounded-sm px-4 py-1 w-56"
                    onChange={(e) => {
                      if (!assets) return;

                      const selectedAsset = assets.find(
                        (asset) => asset.assetName === e.target.value
                      );

                      if (selectedAsset) {
                        setAssetAttributes({
                          unit: selectedAsset.unit,
                          policyId: selectedAsset.policyId,
                          assetName: selectedAsset.assetName,
                          fingerprint: selectedAsset.fingerprint,
                          quantity: selectedAsset.quantity,
                        });
                      } else {
                        resetAssetAttributes();
                      }
                    }}
                  >
                    <option>Select Token</option>
                    {assets?.map((asset, i) => (
                      <option key={i} value={asset.assetName}>
                        {asset.assetName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex mb-6">
                  <div className="w-28 font-bold py-1">Token Detail</div>
                  <div className="bg-gray-600 rounded-sm px-4 py-6 h-64 w-228">
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">Unit</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.unit}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">policyId</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.policyId}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">assetName</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.assetName}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">fingerprint</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.fingerprint}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="w-24 font-bold py-1">quantity</div>
                      <div className="bg-gray-500 rounded-sm px-4 py-1 w-200">
                        <p>{assetAttributes.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 rounded-xl w-32 h-8 font-bold"
                onClick={async () => {
                  resetWalletAttributes();
                  resetAssetAttributes();

                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
