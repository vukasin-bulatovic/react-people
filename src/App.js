import React, { Component } from 'react';
import fetchUsers from './services/UsersService';
import PostList from './entities/PostList';
import Header from './entities/Header';
import Footer from './entities/Footer';
import PostGrid from './entities/PostGrid';
import HeaderGrid from './entities/HeaderGrid';
import About from './entities/About';
import { HashRouter, Route } from 'react-router-dom';
import AnimateSpin from './entities/SpinKit';
import Message from './entities/Message'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filteredUsers: [],
      users: [],
      male: [],
      female: [],
      isListView: localStorage.getItem('state') === null || undefined ? true : JSON.parse(localStorage.getItem('state')),
      inputValue: '',
      isLoading: true,
      timeStamp: null
    }
  }

  componentDidMount() {
    this.refreshPage()
  }

  handleChange = event => {
    this.setState({
      inputValue: event.target.value
    })
  }

  handleSwitchViewClick = () => {
    this.setState((prevState) => {
      localStorage.setItem('state', JSON.stringify(!prevState.isListView))
      return {
        isListView: !prevState.isListView,
      }
    })
  }

  countFemale = () => {
    this.state.female.splice(0, this.state.female.length)
      this.state.filteredUsers.forEach(user => {
        if(user.gender === 'female'){
          this.state.female.push(user)
        }
    })
    return this.state.female.length
  }

  countMale = () => {
    this.state.male.splice(0, this.state.male.length)
    this.state.filteredUsers.forEach(user => {
      if(user.gender === 'male'){
        this.state.male.push(user)
      }
  })
  return this.state.male.length
}

  onSearchChangeInput = (e) => {
    this.setState({
      filteredUsers: this.state.users.filter(user => (user.firstName.includes(e.target.value) || user.lastName.includes(e.target.value))),
      inputValue: e.target.value
    })
  }

getDateToStorage = () => {
  let date = new Date()
  if(localStorage.getItem('date') === undefined || localStorage.getItem('date') === null){
    localStorage.setItem('date', JSON.stringify(date))
  }else{
    let time = Math.floor(new Date()/1000)- Math.floor(new Date(JSON.parse(localStorage.getItem('date')))/1000)
    localStorage.setItem('date', JSON.stringify(date))
    this.setState({
      timeStamp: time
    })
  }
}

  refreshPage = () => {
    fetchUsers()
      .then(result => {
        this.setState({
          isLoading: false,
          filteredUsers: result,
          users: result
        })
      })
      this.getDateToStorage()
   
  }

  getRighttime = (time) => {
    if(time < 60){
      let finalTime =  time
      if(time === 1){
        return finalTime + ' second ago'
      }else{
        return finalTime + ' seconds ago'
      }
    }else if(time > 86400){
      let finalTime = Math.floor(time/86400 )
      if(finalTime === 1){
        return finalTime + ' day ago' 
      }else{
        return finalTime + ' days ago'
      }
    }
    else if(time > 3600){
        let finalTime = Math.floor(time/3600)
        if(finalTime === 1){
          return finalTime + ' hour ago'
        }else{
          return finalTime + ' hours ago' 
        }
    }else if(time > 60){
        let finalTime =  Math.floor(time/60)
        if(finalTime === 1){
          return finalTime + ' minute ago'
        }else{
          return finalTime + ' minutes ago'
        }
    }
   
}


  animationSwitch = () => {
    if (this.state.isLoading) {
      return (
        <AnimateSpin />
      )
    } 
  }

  messageSwitch = () => {
    if(this.state.filteredUsers.length === 0){
      return(
        <Message />
      )
    }
  }


  render() {

    return (
      <HashRouter>
        <div className="App">
          <Route exact path="/" render={props => (
            <React.Fragment>
              {this.state.isListView ? <Header reload={this.refreshPage} switchView={this.handleSwitchViewClick} title="BIT People" /> : <HeaderGrid reload={this.refreshPage} switchView={this.handleSwitchViewClick} title="BIT People" />}
              {this.animationSwitch()}
              <input placeholder="Search users" type="search" value={this.state.inputValue} onChange={this.onSearchChangeInput} />
              <div className="countGender">
                <p>Male: {this.countMale()}</p>
                <p>Female: {this.countFemale()}</p>
              </div>
              {this.animationSwitch()}
              {this.messageSwitch()}
              {this.state.isListView ? <PostList people={this.state.filteredUsers} isListView={this.state.isListView} /> : <PostGrid people={this.state.filteredUsers} />}
            </React.Fragment>
          )
          } />
          <Route path="/about" component={About} />
          <Footer title="Copyright &copy;" year="2019" time={this.getRighttime(this.state.timeStamp)}/>
        </div >
      </HashRouter>

    );
  }
}

export default App;
