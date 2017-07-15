import React, { Component } from 'react';
import Axios from 'axios';
import Metascraper from 'metascraper';

import "./Link.css";

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.linkFromParent,
      err: '',
      title: '',
      description: '',
      image: '',
      url: '',
      bad_website: false
    }
  }

  render() {
    if (!this.state.bad_website) {
      return (
        <div className="link">
          <a href={this.state.link}>
            <div className="image">
              <img src={this.state.image} height="100" width="100" />
            </div>
            <div className="text">
              <div className="title">
                <h4>{this.state.title}</h4>
              </div>
              <div className="description">
                <h6>{this.state.description}</h6>
              </div>
              <div className="url">
                <h6>{this.state.url}</h6>
              </div>
            </div>
          </a>
        </div>
      )  
    } else {
      return (
        <div>
          <h4>This page doesn't exist!</h4>
        </div>
      )
    }  
  }

  getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
  }

  componentDidMount() {
    Axios.get(this.state.link).then((res) => {
      this.setState({
        title: this.getTitle(res.data)
      })
    }).catch((err) => {
      this.setState({err});
      console.log(this.state);
    })

    Metascraper
      .scrapeUrl(this.state.link)
      .then((metadata) => {
        console.log(metadata)
        console.log(this.state)
        if (metadata.title && metadata.description && metadata.image) {
          this.setState({title: metadata.title, description: metadata.description, image: metadata.image, url: metadata.url, bad_website: false});
          if (!metadata.url) {
            this.setState({url: this.state.link});
          }
          if (!this.state.description) {
            this.setState({description: `Visit ${this.state.title}!`});
          }
        } 
    }).catch((err) => {
      console.log(err)
      this.setState({image: '', bad_website: true});
    })
  }
}

export default Link;
//if no image => do something google/wikipedia