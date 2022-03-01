import { gql } from 'apollo-server'
import { ApolloServer, UserInputError } from 'apollo-server'
import {v4 as uuid} from 'uuid'

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
    }
`

const resolvers = {
    Query:{
        personCount: () => persons.length,
        allPersons: (root, args) => {
            if(!args.phone) return persons
            
            const byPhone = person => args.phone === "YES"? person.phone : !person.phone ;
              
            return persons.filter(byPhone)
        },
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation:{
        addPerson : (root, args) =>{
            if(persons.find(p => p.name === args.name && p.phone === args.phone)){
                throw new UserInputError('It seems that the info is duplicated', 
                { invalidArgs: args.name })
            }
            const person = {...args, id:uuid()}
            persons.push(person) // update database with new person
            return person
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