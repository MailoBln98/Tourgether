export type Route = {
  _id: string;
  gpx: string;
  owner_uuid: string;
  owner_name: string;
  name: string;
  start_time: string | { $date: string };
  start_point: string;
  registered_users: string[];
};