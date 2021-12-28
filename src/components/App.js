import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import SocialNetwork from "../abis/SocialNetwork.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  state = {
    accounts: "",
    socialNetwork: null,
    postCount: 0,
    posts: [],
    loading: true,
    metamask: false
  };

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadWeb3() {
    if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
      // if we are in browser and Metamask is already installed
      window.ethereum.enable();
      window.web3 = new Web3(window.web3.currentProvider);
      this.setState({ metamask: true });
    } else {
      // we are on server or user is not running Metamask
      const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/aaa697ff9b38438585c95dc555c75afa"
      );
      window.web3 = new Web3(provider);
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // load accounts
    const accounts = await web3.eth.getAccounts();
    this.setState({ accounts: accounts[0] });
    // Network // ID
    const networkId = await web3.eth.net.getId();
    const networkData = SocialNetwork.networks[networkId];

    if (networkData) {
      const socialNetwork = web3.eth.Contract(
        SocialNetwork.abi,
        networkData.address
      );
      this.setState({ socialNetwork });
      const postCount = await socialNetwork.methods.postCount().call();
      this.setState({ postCount });
      // Load posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call();
        this.setState({ posts: [...this.state.posts, post] });
      }
      // Sort posts to view highest tipped posts at top
      this.setState({
        posts: this.state.posts.sort((a, b) => b.tipAmount - a.tipAmount)
      });
      this.setState({ loading: false });
    } else {
      window.alert("SocialNetwork contract not deployed to detected network");
    }
    // Address
    // ABI
  }
  createPost = content => {
    this.setState({ loading: true });
    this.state.socialNetwork.methods
      .createPost(content)
      .send({ from: this.state.accounts })
      .then("receipt", receipt => {
        this.setState({ loading: false });
      });
  };

  tipPost = (id, tipAmount) => {
    this.setState({ loading: true });
    this.state.socialNetwork.methods
      .tipPost(id)
      .send({ from: this.state.accounts, value: tipAmount })
      .on("receipt", receipt => {
        this.setState({ loading: false });
      });
  };
  render() {
    return (
      <div>
        <Navbar account={this.state.accounts} />
        {this.state.loading ? (
          <div id="loader" className="text-center mt-5">
            <p>Loading...</p>
          </div>
        ) : (
          <Main
            posts={this.state.posts}
            createPost={this.createPost}
            tipPost={this.tipPost}
            metamask={this.state.metamask}
          />
        )}
      </div>
    );
  }
}

export default App;
