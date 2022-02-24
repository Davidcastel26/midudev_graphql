import {gql} from 'apollo-server'
import { ApolloServer } from 'apollo-server'

const persons = [
    {
        name:'dave',
        phone:'435-3456',
        street:'calle promesas',
        city:'buenos Aires',
        id:'12'
    },
    {
        name:'dave2',
        street:'Avenida fullstack',
        phone:'999-3456',
        city:'Guate',
        id:'1'
    },
    {
        name:'dave3',
        street:'Pasaje Testing',
        phone:'00777756',
        city:'Ibiza',
        check:'',
        id:'156'
    }
]

const typeDefs = gql`

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
        allPersons:[Person]!
        findPerson(name: String!): Person
    } 
`

const resolvers = {
    Query:{
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
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