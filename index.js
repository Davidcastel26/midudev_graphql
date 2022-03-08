import { gql } from 'apollo-server'
import { ApolloServer, UserInputError } from 'apollo-server'
import {v4 as uuid} from 'uuid'
import axios from 'axios'

const persons = [
    {
        name: "ale",
        phone:'435-3456',
        street:'calle promesas',
        city:'buenos Aires',
        id:'12'
    },
    {
        name: "ale3",
        street:'Avenida fullstack',
        phone:'999-3456',
        city:'Guate',
        id:'1'
    },
    {
        name: "aless",
        street:'Pasaje Testing',
        phone:'00777756',
        city:'Ibiza',
        check:'',
        id:'156'
    }
]

const typeDefs = gql`

    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }

    type Person{
        name: String!
        phone: String
        street: String!
        city: String!
        check: String!
        id: ID!
        address: Address!
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo):[Person]!
        findPerson(name: String!): Person
    } 

    type Mutation{
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ) : Person
        editNumber(
            name:String!
            phone: String!
        ) : Person
    }
`

const resolvers = {
    Query:{
        personCount: () => persons.length,
        //check this will be an async function
        allPersons: async (root, args) => {
            //that's why we are using AWAIT and check the imports there's an axios there
            const {data: personsFromRESTapi} = await axios.get(`http://localhost:3002/persons`)
            console.log(personsFromRESTapi);

            

            if(!args.phone) return personsFromRESTapi
            
            const byPhone = person => args.phone === "YES"? person.phone : !person.phone ;
              
            return personsFromRESTapi.filter(byPhone)
        },
        findPerson: (root, args) => {
            const {name} = args
            // find is a method that contain already so we are looking for the user with the same name we are sending
            return persons.find(person => person.name === name)
        }
    },
    Mutation:{
        addPerson : async (root, args) =>{
            if(persons.find(p => p.name === args.name && p.phone === args.phone)){
                throw new UserInputError('It seems that the info is duplicated', 
                { invalidArgs: args.name })
            }
            const person = {...args, id:uuid()}
            const p = await axios.post(persons.push(person)) // update database with new person
            return p
        },
        editNumber : (root, args) => {
            //we will get the person who has the name that we are working on, and we save as index
            const personIndex = persons.findIndex(p => p.name === args.name)
            // if the index is -1 means that there is no person with that name so we'll return null
            if(personIndex === -1 ) return null
            // if the person is created we'll get the person index with the data
            const person = persons[personIndex]
            // we are returning the same person but the phone is the one who is throught the info
            const updatePerson = {...person, phone: args.phone}
            // with the original data, we are replacing the data
            persons[personIndex] = updatePerson
            // then we will returning
            return updatePerson
        }
    },
    Person: {
        // name: (root) => root.name
        address: (root) => { return { street : root.street, city: root.city} }
    }
    // Person: {
    //     // name: (root) => root.name
    //     address: (root) => `${root.street}, ${root.city}`,
    //     check: () => "midu"
    // }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then( ({url}) => {
    console.log(`Server listening ${url}`);
})


/*query{
  findPerson(name: "dave") {
    address{
      street
      city
    }
    city
  }
} */