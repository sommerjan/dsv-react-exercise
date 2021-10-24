import "./styles.css";
import { useReducer, useRef, useState, useEffect } from "react";
import Users from "./data";

/** Instructions
   0. Fork this codesandbox and sync it with your github 
   1. import users data from data.ts
   2. Using the useEffect hook:
   2.1. Filter the users data array to only include users where age >= 18
   2.2. Map the users data array to only include username, address, age and companyName
   2.3. Dispatch the data to the local users state
   3. Display the users' properties using a loop in the JSX
   4. Extend the reducer:
   4.1. Count must always be >= 0, in all cases
   4.2. Add a case to increment count with 2
   4.3. Add a case to increment to the nearest odd number
   4.4. Add a case to reset the count
   4.5. Add buttons to said cases
   5. Add a new local state instance called userCoordinates, with an initialState of 0
   5.1. Set up a new useEffect hook with a dependency to users
   5.2. Map the users data array to only include address.geo.lng, as a number
   5.3. Using the .reduce method, sum the array and dispatch the outcome to the local state
   5.4. Print userCoordinates to the console
   6. Using the useRef hook and useEffect hook, auto-focus the input field on load
   7. Add an onChange event to the input, which updates the local state of text
   8. Provide the link to your forked repo with your answers
   */

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count >= 1 ? state.count - 1 : 0 };
    case "incrementDouble":
      return { count: state.count + 2 };
    case "incrementNearestOdd":
      return {
        count: state.count % 2 === 1 ? state.count + 2 : state.count + 1
      };
    case "reset":
      return { count: 0 };
    default:
      throw new Error();
  }
}

function filterUsersByAge(users, age) {
  return users.filter((user) => user.age >= age);
}

function mapUserValues(users) {
  return users.map((user) => {
    return {
      username: user.username,
      address: user.address,
      age: user.age,
      companyName: findCompanyName(user)
    };
  });
}

function mapUserLngCoordinates(users) {
  return users.map((user) => {
    let lng = 0;
    if (user && user.address && user.address.geo && user.address.geo.lng) {
      lng = user.address.geo.lng;
    }
    return Number(lng);
  });
}

function findCompanyName(user) {
  return user.company !== null ? user.company.name : "";
}

function UserList(props) {
  return props.users.map((user) => (
    <li key={user.username}>
      <User user={user} />
    </li>
  ));
}

function User(props) {
  return (
    <span>
      {props.user.username} - <Address address={props.user.address} /> -{" "}
      {props.user.age} - {props.user.companyName}
    </span>
  );
}

function Address(props) {
  if (!props.address) {
    return <span />;
  }
  return (
    <span>
      {props.address.street}, {props.address.suite}, {props.address.city},{" "}
      {props.address.zipcode}, <Geo geo={props.address.geo} />
    </span>
  );
}

function Geo(props) {
  if (!props.geo) {
    return <span />;
  }
  return (
    <span>
      {props.geo.lat}, {props.geo.lng}
    </span>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [userCoordinates, setUserCoordinates] = useState(0);
  const [countState, dispatch] = useReducer(reducer, { count: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const filteredUsers = filterUsersByAge(Users, 18);
    const mappedUsers = mapUserValues(filteredUsers);

    setUsers(mappedUsers);
  }, []);

  useEffect(() => {
    const userCoordinatesList = mapUserLngCoordinates(Users);
    const userCoordinatesSum = userCoordinatesList.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );

    setUserCoordinates(userCoordinatesSum);
    console.log(userCoordinates);
  }, [userCoordinates]);

  return (
    <div className="App">
      <p>Count: {countState.count}</p>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "incrementDouble" })}>+2</button>
      <button onClick={() => dispatch({ type: "incrementNearestOdd" })}>
        +1/+2
      </button>
      <button onClick={() => dispatch({ type: "reset" })}>x</button>
      <input value={text} />
      <UserList users={users} />
    </div>
  );
}
