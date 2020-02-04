import React, { Component } from 'react';
import { Button, Table, Tabs, Tab, Modal } from 'react-bootstrap';
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
		transactionArray: [],
		transBlitzID: '',
		show: false,
		modalContent: {},
		hospitality: []
	};
	// proxy = 'http://localhost:8080';
	proxy = '';
	fetchAccomodation() {
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
	fetchTransaction() {
		axios
			.post(this.proxy + '/viewTransactions')
			.then((res) => {
				res = res.data;
				if (res.status) {
					this.setState({ transactionArray: [...res.message] });
				} else {
					alert('Internal Error!');
				}
			})
			.catch((e) => console.log(e));
	}
	componentDidMount() {
		// console.log(this.props);
		this.setState({ eventSelected: this.props.eventID[0] });
		if (this.props.id === 11) {
			this.fetchAccomodation();
			this.fetchTransaction();
		}
	}
	componentDidUpdate() {
		// console.log(this.state);
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
	makePaymentHistory(obj) {
		if (!obj.paymentHistory) return null;
		let item = [];
		for (let i = 0; i < obj.paymentHistory.length; i++) {
			let e = obj.paymentHistory[i];
			item.push(
				<li>
					Amount: {e.amount}
					<br />
					Transaction ID: {e.transactionID}
					<br />
					Hospitality Options: {e.packages.join(' ')}
					<br />
				</li>
			);
		}
		return <ol>{item}</ol>;
	}
	renderTableUser(obj) {
		console.log(obj);
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
					<tr>
						<th>Approved Payments</th>
						<td>{this.makePaymentHistory(obj)}</td>
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
	openModal(trans) {
		this.setState({ show: true, modalContent: trans, hospitality: [] });
	}
	closeModal() {
		this.setState({ show: false, modalContent: {}, hospitality: [] });
	}
	handleHospitalityString(e) {
		let arr = e.target.value.split(' ');
		this.setState({ hospitality: [...arr] });
	}
	approveTransaction() {
		let { hospitality, modalContent } = this.state;
		let arr = [];
		for (let i = 0; i < hospitality.length; i++) {
			if (hospitality[i]) {
				arr.push(parseInt(hospitality[i]));
			}
		}
		let valid = true;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] < 1 || arr[i] > 14 || isNaN(arr[i]) || Array.from(new Set(arr)).length != arr.length)
				valid = false;
		}
		if (arr.length && valid) {
			console.log(arr);
			let obj = { ...modalContent, packages: [...arr] };
			axios
				.post(this.proxy + '/transaction', obj)
				.then((res) => {
					res = res.data;
					if (res.status) {
						alert('Approved!');
						this.fetchTransaction();
						this.closeModal();
					} else {
						alert('Unable to Approve, Internal Error!');
					}
				})
				.catch((e) => console.log(e));
		} else {
			alert('Please enter Valid Package Numbers! Please check for Repeated Values.');
		}
	}
	viewTransaction() {
		let { filterText, show, modalContent, hospitality } = this.state;
		filterText = filterText.trim();
		let arr = this.state.transactionArray;
		// console.log(arr);
		if (filterText) {
			let arr2 = [];
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].blitzID.includes(filterText)) arr2.push(arr[i]);
			}
			arr = arr2;
		}
		let item = [];
		for (let i = 0; i < arr.length; i++) {
			item.push(
				<tr>
					<td>{i + 1}</td>
					<td>{arr[i].blitzID}</td>
					<td>{arr[i].firstName + ' ' + arr[i].lastName}</td>
					<td>{arr[i].mob}</td>
					<td>{arr[i].email}</td>
					<td>{arr[i].transactionID}</td>
					<td>{arr[i].amount}</td>
					<td>{arr[i].approval ? 'YES' : 'NO'}</td>
					<td>
						{arr[i].approval ? null : (
							<Button
								type="success"
								onClick={() => {
									this.openModal(arr[i]);
								}}
							>
								Approve
							</Button>
						)}
					</td>
				</tr>
			);
		}
		return (
			<div>
				<Modal
					show={show}
					onHide={() => {
						this.closeModal();
					}}
				>
					<Modal.Header closeButton>
						<Modal.Title>Approve Transaction</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table bordered responsive>
							<thead></thead>
							{Object.keys(modalContent).length ? (
								<tbody>
									<tr>
										<td>Blitz ID</td>
										<td>{modalContent.blitzID}</td>
									</tr>
									<tr>
										<td>Name</td>
										<td>{modalContent.firstName + ' ' + modalContent.lastName}</td>
									</tr>
									<tr>
										<td>Mobile</td>
										<td>{modalContent.mob}</td>
									</tr>
									<tr>
										<td>Email</td>
										<td>{modalContent.email}</td>
									</tr>
									<tr>
										<td>Transaction ID</td>
										<td>{modalContent.transactionID}</td>
									</tr>
									<tr>
										<td>Amount</td>
										<td>{modalContent.amount}</td>
									</tr>
								</tbody>
							) : null}
						</Table>
						<label htmlFor="hospitalityString">
							Enter package number as mentioned on the website, separated by space. Eg: 1 12 5 6 -
						</label>
						<input
							type="text"
							value={hospitality.join(' ')}
							id="hospitalityString"
							onChange={() => {
								this.handleHospitalityString(event);
							}}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="success"
							onClick={() => {
								this.approveTransaction();
							}}
						>
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
				<br />
				<h3>Transactions: </h3>
				<br />
				<Button
					onClick={() => {
						this.fetchTransaction();
					}}
				>
					Refresh
				</Button>
				<br />
				<br />
				<input
					type="text"
					id="filterText"
					value={filterText}
					onChange={() => {
						this.handleFilterText(event);
					}}
					placeholder="Filter by Blitz ID"
				/>
				<Table bordered responsive>
					<thead>
						<tr>
							<td>#</td>
							<td>Blitz ID</td>
							<td>Name</td>
							<td>Mobile</td>
							<td>Email</td>
							<td>Transaction ID</td>
							<td>Amount</td>
							<td>Approved</td>
							<td>Change Status</td>
						</tr>
					</thead>
					<tbody>{item}</tbody>
				</Table>
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
				<Button
					onClick={() => {
						this.fetchAccomodation();
					}}
				>
					Refresh
				</Button>
				<br />
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
						<tr>
							<td>#</td>
							<td>Blitz ID</td>
							<td>Name</td>
							<td>Gender</td>
							<td>Mobile</td>
							<td>Email</td>
							<td>College</td>
							<td>City</td>
						</tr>
					</thead>
					<tbody>{item}</tbody>
				</Table>
			</div>
		);
	}
	selectOption(option) {
		this.setState({
			option,
			eventArray: [],
			userSearchID: '',
			userObj: [],
			filterText: '',
			transBlitzID: '',
			show: false,
			modalContent: {},
			hospitality: []
		});
	}
	render() {
		return (
			<div>
				<Tabs
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
			</div>
		);
	}
}
