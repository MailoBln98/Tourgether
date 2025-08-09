export interface Route {
  _id: string;
  gpx: string;
  owner_uuid: string;
  start_time: string | { $date: string };
  start_point: string;
  registered_users: string[];
}