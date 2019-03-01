import { Key, PutItemInput, PutItemOutput } from "aws-sdk/clients/dynamodb";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import uuid from "uuid/v1";
import * as db from "../../service/dynamo";
import { Context } from "../context";
import { Place } from "../types/place.type";

@Resolver(of => Place)
export class ReviewResolver {
  @Mutation(() => Place)
  public addPlace(
    @Ctx() ctx: Context,
    @Arg("address") address: string,
    @Arg("city") city: string,
    @Arg("latitude") latitude: number,
    @Arg("longitude") longitude: number,
    @Arg("name") name: string,
    @Arg("state") state: string
  ): Place {
    const newPlace: Place = {
      added_by: ctx.user_id,
      address,
      city,
      is_open: true,
      latitude,
      longitude,
      name,
      place_id: uuid(),
      rank: -1,
      state
    };

    const params = {
      TableName: "Reviews",
      Item: newPlace
    } as unknown;

    db.createItem(params as PutItemInput)
    return newPlace;
  }
}

// export function getPlaces() {
//   const params = {
//     TableName,
//     AttributesToGet: [
//       "place_id",
//       "name",
//       "address",
//       "city",
//       "state",
//       "rank",
//       "latitude",
//       "longitude",
//       "created_at"
//     ]
//   };

//   return db.scan(params);
// }

// export function getPlaceById(place_id: Key) {
//   const params = {
//     TableName,
//     Key: {
//       place_id
//     }
//   };

//   return db.get(params);
// }

// export function addPlace(args: { [property: string]: AttributeValue }) {
//   const params = {
//     TableName,
//     Item: {
//       place_id: uuid() as AttributeValue,
//       name: args.name,
//       address: args.address,
//       city: args.city,
//       state: args.state,
//       rank: args.rank,
//       latitude: args.latitude,
//       longitude: args.longitude,
//       modified_at: datetime.getTime() as AttributeValue
//     }
//   };

//   return db.createItem(params);
// }

// export function updatePlaceRank(place_id: Key, rank: AttributeValue) {
//   const params = {
//     TableName,
//     Key: {
//       id: place_id
//     },
//     ExpressionAttributeValues: {
//       ":rank": rank
//     },
//     UpdateExpression: "SET rank = :rank",
//     ReturnValues: "ALL_NEW"
//   };

//   return db.updateItem(params);
// }

// export function deletePlace(place_id: Key) {
//   const params = {
//     TableName,
//     Key: {
//       id: place_id
//     }
//   };

//   return db.deleteItem(params);
// }

// export function getPaginatedPlaceReviews(args) {
//   const params = {
//     TableName: "Reviews",
//     KeyConditionExpression: "place_id = :v1",
//     ExpressionAttributeValues: {
//       ":v1": args.place_id
//     },
//     IndexName: "place-reviews",
//     ScanIndexForward: false
//   };

//   if (args.limit) {
//     params.Limit = args.limit;
//   }

//   if (args.nextToken) {
//     params.ExclusiveStartKey = {
//       review_id: args.nextToken.review_id,
//       place_id: args.nextToken.place_id,
//       created_at: args.nextToken.created_at
//     };
//   }

//   return db.query(params).then(result => {
//     const reviews = [];
//     let listOfReviews;

//     console.log(result);

//     if (result.Items.length >= 1) {
//       listOfReviews = {
//         items: []
//       };
//     }

//     for (let i = 0; i < result.Items.length; i += 1) {
//       reviews.push({
//         review_id: result.Items[i].review_id,
//         place_id: result.Items[i].place_id,
//         created_at: result.Items[i].created_at,
//         handle: result.Items[i].handle,
//         review: result.Items[i].review,
//         upvote_count: result.Items[i].upvote_count
//       });
//     }

//     listOfReviews.items = reviews;

//     if (result.LastEvaluatedKey) {
//       listOfReviews.nextToken = {
//         review_id: result.LastEvaluatedKey.review_id,
//         place_id: result.LastEvaluatedKey.place_id,
//         created_at: result.LastEvaluatedKey.created_at,
//         handle: result.LastEvaluatedKey.handle
//       };
//     }

//     return listOfReviews;
//   });
// }
