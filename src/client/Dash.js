import React, { Component } from 'react';
import { Button, Table, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
export default class Dash extends Component {
	state = {
		option: 0,
		eventSelected: '',
		eventArray: [],
		userSearchID: '',
		userObj: {},
		filterText: '',
		accomodationArray: [],
		transBlitzID: ''
	};
	proxy = 'http://localhost:8080';
	// proxy = '';
	componentDidMount() {
		// console.log(this.props);
		this.setState({ eventSelected: this.props.eventID[0] });
		if (this.props.id === 11) {
			axios
				.post(this.proxy + '/accomodation')
				.then((res) => {
					res = res.data;
					if (res.status) {
						// console.log(res.message);
						let maleArr = res.message.males;
						let femaleArr = res.message.females;
						let otherArr = res.message.others;
						for (let i = 0; i < maleArr.length; i++) maleArr[i]['gender'] = 'Male';
						for (let i = 0; i < femaleArr.length; i++) femaleArr[i]['gender'] = 'Female';
						for (let i = 0; i < otherArr.length; i++) femaleArr[i]['gender'] = 'Other';

						this.setState({ accomodationArray: [...maleArr, ...femaleArr, ...otherArr] });
					} else {
						alert('Internal Error!');
					}
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}
	componentDidUpdate() {
		console.log(this.state);
	}
	handleFilterText(e) {
		// console.log(e.target.value);
		this.setState({ filterText: e.target.value });
	}
	handleEventSelect(e) {
		this.setState({ eventSelected: Number(e.target.value) });
	}
	handleEventSubmit(e) {
		let { eventSelected } = this.state;
		e.preventDefault();
		axios
			.post(this.proxy + '/eventdata', { eventID: eventSelected })
			.then((res) => {
				res = res.data;
				if (res.status) {
					this.setState({ eventArray: res.message });
				} else {
					alert('Internal Error!');
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}
	renderTable(arr) {
		let item = [];
		let { filterText } = this.state;
		filterText = filterText.trim();
		// console.log(arr);
		if (filterText) {
			let arr2 = [];
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].blitzID.includes(filterText)) arr2.push(arr[i]);
			}
			arr = arr2;
		}
		for (let i = 0; i < arr.length; i++) {
			let e = arr[i];
			// console.log(e);
			item.push(
				<tr key={`t1-${i}`}>
					<td>{i + 1}</td>
					<td>{e.blitzID}</td>
					<td>{e.firstName + ' ' + e.lastName}</td>
					<td>{e.teamID}</td>
					<td>{e.teamName}</td>
					<td>{e.teamSize}</td>
					<td>{e.mob}</td>
					<td>{e.email}</td>
				</tr>
			);
		}
		return (
			<Table striped responsive bordered>
				<thead>
					<tr>
						<td>#</td>
						<td>Blitz ID</td>
						<td>Name</td>
						<td>Team ID</td>
						<td>Team Name</td>
						<td>Team Size</td>
						<td>Mobile</td>
						<td>Email</td>
					</tr>
				</thead>
				<tbody>{item}</tbody>
			</Table>
		);
	}
	viewEvents() {
		let drop = [];
		const { eventArray, filterText } = this.state;
		for (let i = 0; i < this.props.eventName.length; i++)
			drop.push(
				<option key={`opt-${i}`} id={this.props.eventID[i]} value={this.props.eventID[i]}>
					{this.props.eventName[i]}
				</option>
			);
		return (
			<div>
				<br />
				<h3>Events:</h3>
				<br />
				<form
					onSubmit={() => {
						this.handleEventSubmit(event);
					}}
				>
					<select
						onChange={() => {
							this.handleEventSelect(event);
						}}
					>
						{drop}
					</select>
					<button type="submit">Submit</button>
					<br />
					<input
						type="text"
						value={filterText}
						onChange={() => {
							this.handleFilterText(event);
						}}
						placeholder="Filter by Blitz ID"
					/>
				</form>
				<div>{this.renderTable(eventArray)}</div>
			</div>
		);
	}
	handleUserChange(e) {
		this.setState({ userSearchID: e.target.value });
	}
	makeHospitalityOptions(obj) {
		if (!obj.hospitality) return '';
		let opt = '';
		obj.hospitality.sort();
		for (let i = 0; i < obj.hospitality.length; i++) {
			opt += obj.hospitality[i] + ' ';
		}
		return opt;
	}
	makeParticipateList(obj) {
		if (!obj.events) return null;

		let ev = [];
		for (let i = 0; i < obj.events.length; i++)
			ev.push(
				<li>
					{obj.events[i].name}
					<br /> ID: {obj.events[i].teamID}
					<br /> Team Name: {!obj.events[i].teamName.length ? 'N/A' : obj.events[i].teamName}
					<br /> Team Size: {obj.events[i].teamSize}
				</li>
			);
		return <ol>{ev}</ol>;
	}
	renderTableUser(obj) {
		return (
			<Table bordered responsive>
				<thead></thead>
				<tbody>
					<tr>
						<th>Blitz ID</th>
						<td>{obj.blitzID}</td>
					</tr>
					<tr>
						<th>First Name</th>
						<td>{obj.firstName}</td>
					</tr>
					<tr>
						<th>Last Name</th>
						<td>{obj.lastName}</td>
					</tr>
					<tr>
						<th>Gender</th>
						<td>{obj.gender}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{obj.email}</td>
					</tr>
					<tr>
						<th>Mobile</th>
						<td>{obj.mob}</td>
					</tr>
					<tr>
						<th>Course</th>
						<td>{obj.course}</td>
					</tr>
					<tr>
						<th>Year</th>
						<td>{obj.year}</td>
					</tr>
					<tr>
						<th>Branch</th>
						<td>{obj.branch}</td>
					</tr>
					<tr>
						<th>City</th>
						<td>{obj.city}</td>
					</tr>
					<tr>
						<th>College</th>
						<td>{obj.college}</td>
					</tr>
					<tr>
						<th>College ID</th>
						<td>{obj.collegeID}</td>
					</tr>
					<tr>
						<th>Accomodation</th>
						<td>{obj.accomodation ? 'YES' : 'NO'}</td>
					</tr>
					<tr>
						<th>Participated Events</th>
						<td>{this.makeParticipateList(obj)}</td>
					</tr>
					<tr>
						<th>Hospitality Options</th>
						<td>{this.makeHospitalityOptions(obj)}</td>
					</tr>
				</tbody>
			</Table>
		);
	}
	handleUserSubmit(e) {
		e.preventDefault();
		// console.log(this.state.userSearchID);
		const { userSearchID } = this.state;
		axios
			.post(this.proxy + '/user', { blitzID: userSearchID })
			.then((res) => {
				res = res.data;
				// console.log(res);
				if (res.status) {
					this.setState({ userObj: res.message });
				} else {
					alert('Invalid ID!');
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}
	viewUser() {
		const { userSearchID, userObj } = this.state;
		return (
			<div>
				<br />
				<h3>User:</h3>
				<br />
				<form
					onSubmit={() => {
						this.handleUserSubmit(event);
					}}
				>
					<input
						type="text"
						id="userSearchID"
						value={userSearchID}
						onChange={() => {
							this.handleUserChange(event);
						}}
					/>
					<button type="submit">Submit</button>
				</form>
				<div>{this.renderTableUser(userObj)}</div>
			</div>
		);
	}
	handleTransactionChange(e) {
		this.setState({ transBlitzID: e.target.value });
	}
	handleTransactionSubmit(e) {
		e.preventDefault();
		const { transBlitzID } = this.state;
		console.log(transBlitzID);
	}
	viewTransaction() {
		const { transBlitzID } = this.state;
		return (
			<div>
				<br />
				<h3>Transactions: </h3>
				<br />
				<form
					onSubmit={() => {
						this.handleTransactionSubmit(event);
					}}
				>
					<input
						type="text"
						id="transBlitzID"
						value={transBlitzID}
						onChange={() => {
							this.handleTransactionChange(event);
						}}
						placeholder="Enter Blitz ID"
					/>
					<button type="submit">Submit</button>
				</form>
			</div>
		);
	}
	viewAccomodation() {
		let { accomodationArray, filterText } = this.state;
		filterText = filterText.trim();
		if (filterText) {
			let arr2 = [];
			for (let i = 0; i < accomodationArray.length; i++) {
				if (accomodationArray[i].blitzID.includes(filterText)) arr2.push(accomodationArray[i]);
			}
			accomodationArray = arr2;
		}
		let item = [];
		for (let i = 0; i < accomodationArray.length; i++) {
			let e = accomodationArray[i];
			item.push(
				<tr>
					<td>{i + 1}</td>
					<td>{e.blitzID}</td>
					<td>{e.firstName + ' ' + e.lastName}</td>
					<td>{e.gender}</td>
					<td>{e.mob}</td>
					<td>{e.email}</td>
					<td>{e.college}</td>
					<td>{e.city}</td>
				</tr>
			);
		}
		return (
			<div>
				<br />
				<h3>Accomodation: </h3>
				<br />
				<input
					type="text"
					value={filterText}
					onChange={() => {
						this.handleFilterText(event);
					}}
					placeholder="Filter by Blitz ID"
				/>
				<Table bordered responsive>
					<thead>
						<td>#</td>
						<td>Blitz ID</td>
						<td>Name</td>
						<td>Gender</td>
						<td>Mobile</td>
						<td>Email</td>
						<td>College</td>
						<td>City</td>
					</thead>
					<tbody>{item}</tbody>
				</Table>
			</div>
		);
	}
	display() {
		const { option } = this.state;
		switch (option) {
			case 0:
				return this.viewEvents();
			case 1:
				return this.viewUser();
			case 2:
				return this.viewTransaction();
			case 3:
				return this.viewAccomodation();
			default:
				return this.viewEvents();
		}
	}
	selectOption(option) {
		// console.log(arguments);
		// console.log('selecting ' + option);
		this.setState({ option, eventArray: [], userSearchID: '', userObj: [], filterText: '', transBlitzID: '' });
	}
	render() {
		return (
			<div>
				<Tabs
					variant="pills"
					defaultActiveKey="0"
					id="uncontrolled-tab-example"
					onSelect={(k) => {
						this.selectOption(Number(k));
					}}
				>
					<Tab eventKey="0" title="Event Registerations">
						{this.display()}
					</Tab>
					<Tab eventKey="1" title="User Details" disabled={this.props.id === 11 ? false : true}>
						{this.viewUser()}
					</Tab>
					<Tab eventKey="2" title="Accomodation" disabled={this.props.id === 11 ? false : true}>
						{this.viewAccomodation()}
					</Tab>
					<Tab eventKey="3" title="Transactions" disabled={this.props.id === 11 ? false : true}>
						{this.viewTransaction()}
					</Tab>
				</Tabs>
				{/* <div>
					<Button
						onClick={() => {
							this.handleEventSelect({ target: { value: this.props.eventID[0] } });
							this.selectOption(0);
						}}
					>
						View Event Registrations
					</Button>
				</div>
				&nbsp;
				{this.props.id === 11 ? (
					<div>
						<Button
							onClick={() => {
								this.selectOption(1);
							}}
						>
							View User Details
						</Button>
						&nbsp;
						<Button
							onClick={() => {
								this.selectOption(2);
							}}
						>
							View/Approve Transactions
						</Button>
						&nbsp;
						<Button
							onClick={() => {
								this.selectOption(3);
							}}
						>
							View Accomodation List
						</Button>
						&nbsp;
					</div>
				) : null}
				{this.display()} */}
			</div>
		);
	}
}
