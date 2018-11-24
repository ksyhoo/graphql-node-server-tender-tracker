const graphql = require('graphql')
const {GraphQLObjectType,
       GraphQLID,
       GraphQLString,
       GraphQLSchema,
       GraphQLList,
       GraphQLNonNull
     } = graphql
const _ = require('lodash')
const Tender = require('../models/tender')
const Entity = require('../models/entity')


//mock data

// const mockTenders = [
//     {id:'1', title: 'test 1', description: "desc 1", entityID: '1'},
//     {id:'4', title: 'test 1232', description: "desc 1", entityID: '1'},
//     {id:'2', title: 'test 2', description: "desc 2", entityID: '2'},
//     {id:'3', title: 'test 3', description: "desc 3", entityID: '3'},
// ]
// const mockEntities = [
//     {id:'1', name: 'szpital', adress: "dzieciecy"},
//     {id:'2', name: 'placowka', adress: "dorosly"},
//     {id:'3', name: 'lecznica', adress: "upadajaca"},
// ]

const TenderType = new GraphQLObjectType({
    name: 'Tender',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        entity: {
            type: EntityType,
            resolve(parent, args){
                // return _.find(mockEntities, {id: parent.entityID})
                return Entity.findById(parent.entityID)
            }
        },
        // entity: rel ref,
    })
})
const EntityType = new GraphQLObjectType({
    name: 'Entity',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        adress: {type: GraphQLString},
        tenders: {
            type: new GraphQLList(TenderType),
            resolve(parent, args){
                // return _.filter(mockTenders, {entityID: parent.id})
                return Tender.find({
                    entityID: parent.id
                })
            }
        }
        // contactPerson: rel ref,
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        tender: {
            type: TenderType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return Tender.findById(args.id)
            }
        },

        tenders: {
            type: new GraphQLList(TenderType),
            resolve(parent, args){
                return Tender.find()
            }
        },

        entity: {
            type: EntityType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return Entity.findById(args.id)
                
            }
        },
        
        entities:{
            type: new GraphQLList(EntityType),
            resolve(parent, args){
                return Entity.find()
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addEntity: {
            type: EntityType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                adress: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                let entity = new Entity({
                    name: args.name,
                    adress: args.adress,
                })
                return entity.save()
            }
        },

        addTender: {
            type: TenderType,
            args: {
                title: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                entityID: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let tender = new Tender({
                    title: args.title,
                    description: args.description,
                    entityID: args.entityID,
                })
                return tender.save()
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})