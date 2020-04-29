const {Component}=React;
const {Router,Route,IndexRoute,Link}=ReactRouter;
 
class Main extends Component{
    render(){
        return(
            <div>
                <h1>Hyperledger Fabric Study</h1>
                <ul className="header">
                    <li><Link exact to="/">Home</Link></li>
                    <li><Link to="/basic">BasicNetwork</Link></li>
                    <li><Link to="/first">FirstNetwork</Link></li>
          <li><Link to="/fabcar">Fabcar</Link></li>
                </ul>
                
                
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class Fabcar extends Component{
    state= {
        car:[],
    }

    getAllCars = () =>{
        axios.get('fabcar_network/get_all_car')
        .then((res)=>{
            // console.log(res.data.queryAllCars);
            const a = JSON.parse(res.data.queryAllCars);
            console.log(a);

            const car = a.map((item)=>{
                return <tr>
                            <th>{item.Key}</th>
                            <th>{item.Record.color}</th>
                            <th>{item.Record.make}</th>
                            <th>{item.Record.model}</th>
                            <th>{item.Record.owner}</th>
                        </tr>
            })
            console.log(car);
            this.setState({
                car,
            })

        })
        .catch((error)=>{
            console.log(error);
        });
    }
    
    render(){

        return (
            <div>
                <a href='fabcar.html' > 중고차 시장 가기 </a>
                <br/>
                <button onClick={this.getAllCars}>getAllCars</button>
                <table className="table table-spriped">
                    <tr><th>ID</th><th>Color</th><th>Make</th><th>Model</th><th>Owner</th></tr>
                    {this.state.car}
                </table>
            </div>
        );

    }
}

 
class Home extends Component{
    render(){
        return(
            <div>
                <h2>Home</h2>
            </div>
        );
    }
}
class BasicNetwork extends Component{
    state={
        a_amount:0,
        b_amount:0
    }
 
    basic_network_connect=()=>{
        axios.get('basic_network/connect')
        .then((res)=>{
            console.log(res);
        })
        .catch((error)=>{
            console.log(error);
        });
    }
 
    query=()=>{        
        axios.get('/basic_network/query')
        .then((response)=>{            
            this.setState({a_amount:response.data.a_amount, b_amount:response.data.b_amount});
        })
        .catch((error)=>{
            console.log(error);
        });
    }
 
    send=()=>{
        alert(this.amount.value);
        axios.post('/basic_network/send',{"amount":this.amount.value})
        .then((response)=>{
            console.log(response);
            
        })
        .catch((error)=>{
            console.log(error);
        });
    }
 
    render(){
       
        return(
            <div>
                <h2>BasicNetwork
                에 <button onClick={this.basic_network_connect}>연결</button></h2>
                <br/>
                <button onClick={this.query}  > 잔액 확인</button> {' '} 
                a : <Amount bgColor='green' amount={this.state.a_amount}></Amount>
                b : <Amount bgColor='red' amount={this.state.b_amount}></Amount>
                <br/>               
                <br/> 
                <div>a가 b에게 {' '}
                <input placeholder='송금량' ref={ref=>this.amount=ref} />원을 {' '} 
                <button onClick={this.send}  > 보내기</button><br/>               
                </div>
 
            </div>
        );
    }
}
class Amount extends Component{
    render(){
        var amountStyle={
            padding:10,
            margin:20,
            display:"inline-block",
            backgroundColor: this.props.bgColor,
            borderRadius: "50%" ,
            width : this.props.amount,
            height: this.props.amount,            
            textAlign: "center"            
        }
        return (
            <span style={amountStyle}>{this.props.amount}원</span>
        );
    }
}
 
class FirstNetwork extends Component{
    state={
        a_amount:0,
        b_amount:0
    }
 
    first_network_connect=()=>{
        axios.get('first_network/connect')
        .then((res)=>{
            console.log(res);
        })
        .catch((error)=>{
            console.log(error);
        });
    }
 
    query=()=>{        
        axios.get('/first_network/query')
        .then((response)=>{            
            this.setState({a_amount:response.data.a_amount, b_amount:response.data.b_amount});
        })
        .catch((error)=>{
            console.log(error);
        });
    }
 
    send=()=>{
        alert(this.amount.value);
        axios.post('/first_network/send',{"amount":this.amount.value})
        .then((response)=>{
            console.log(response);
            
        })
        .catch((error)=>{
            console.log(error);
        });
    }
 
    render(){
       
        return(
            <div>
                <h2>FirstNetwork
                에 <button onClick={this.first_network_connect}>연결</button></h2>
                <br/>
                <button onClick={this.query}  > 잔액 확인</button> {' '} 
                a : <Amount bgColor='magenta' amount={this.state.a_amount}></Amount>
                b : <Amount bgColor='cyan' amount={this.state.b_amount}></Amount>
                <br/>               
                <br/> 
                <div>a가 b에게 {' '}
                <input placeholder='송금량' ref={ref=>this.amount=ref} />원을 {' '} 
                <button onClick={this.send}  > 보내기</button><br/>               
                </div>
 
            </div>
        );
    }
}
 
ReactDOM.render(
    (<Router>
        <Route path="/" component={Main} >
            <IndexRoute component={Home} />
            <Route path="basic" component={BasicNetwork} />
            <Route path="first" component={FirstNetwork} />
       <Route path="fabcar" component={Fabcar} />
        </Route>
    </Router>)
     , document.getElementById("root")
);