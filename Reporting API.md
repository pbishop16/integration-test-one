# Digital Lumens LightRules Reporting API

# Revision History
- 2012-07-10 bjc
  - First pass
- 2012-07-25 bjc
  - Added short "Authentication" blurb
- 2012-11-09 bdv
  - Bringing doc into line with final implementation
- 2013-02-06 bdv
  - DL Admin user exclusion
- 2013-11-04 djm
  - Added engine_status_code to Lights GET API
- 2013-12-05 djm
  - Added support for profile queries and push/cancel
- 2014-02-11 rad
  - Rooms are retrieved via UUID
- 2014-05-11 djm
  - updated some phrasing and formatting
- 2014-07-16 bdv
  - removed profile_id and profile_name from Get Profile Activation Status
- 2015-09-21 bdv
  - added control stations
  - additional clarification and examples
- 2015-09-29 bdv
  - updated active_profiles routes
  - added active_profiles delete by profile id
- 2015-10-02 bdv
  - added Extend Active Profile
- 2015-10-07 bdv
  - fix documentation bug: Extend Active Profile parameter is "expiration"
- 2015-10-13 bdv
  - In order to support Control Station access, users with the Admin role are
  now permitted to use the API. Also added a note on clock authority to
  Get Active Profile Index
- 2015-10-18 bdv
  - Added order_offset to control_stations response, which is the display order
  of areas in the station as shown by the LightRules web interface


# Overview
 The Digital Lumens LightRules Reporting API (henceforth API) allows third-party systems to query a LightRules Appliance for map and usage data via a simple HTTP request, and receive results in XML or JSON format.

# Authentication
All API requests use token authentication to validate access.  These tokens can only be used to validate the read-only requests covered in the scope of this API and can not be used to change the configuration or operational state of the LightRules system.

The "DL Admin" user which exists on all LightRules Appliances can not be used to access the reporting API.

First create a new user. Give the user “Reporting” user role for read-only access to the API; add
“Operations” role to enable profile activation via the API. On the new User's detail page, copy
the 32-character Auth Token value. This token can be used in either of two ways:

### Method 1: HTTP Authorization headers

This is the preferred, more secure method. Add a new HTTP request header to all your API requests, like this:

Authorization: 0ef334001734867b1f4e19bf8e760965

For example you can specify custom HTTP headers when using the curl utility as follows:

`$ curl http://lightrules.dev/api/v1/report.json -H "Authorization: 0ef334001734867b1f4e19bf8e760965"`

All modern HTTP request libraries will allow you to specify your own headers.


### Method 2: Request Parameters

While testing in the URL field in your browser, you can add the auth token as a parameter for testing:

`http://lightrules.dev/api/v1/report.json?auth_token=0ef334001734867b1f4e19bf8e760965&start=2012-09-04`

You should prefer Method 1 in production because it will NOT expose the auth token in URLs.


### Revoking an Auth Token

Changing a user's password will cause the API Auth token to be regenerated and assigned to that user. Once a new auth token is assigned to a user, the old token value will no longer be accepted.


# Retrieving Map Data
Note: “Reporting” role required to access this portion of the LightRules API.
LightRules map files have three levels of organization - lights (one light object per real-world fixture), zones (each light in exactly one zone) and rooms (each zone in exactly one room).

1. Get Lights
  - Get list of all lights in map.
  - USAGE: http GET /api/v1/lights.[xml|json]
  - RETURNS: A formatted list of all lights in the Appliance's map, showing the following fields:
    - id - unique light ID
    - name - name string
    - sn - serial number, decimal
    - serial - serial number, hex string
    - zone_id - ID of containing zone
    - room_uuid - UUID of containing room
    - flags - flag bitmask
      - bit1 => coordination master; occupancy sensor on this light triggers all lights in the zone
      - bit2 => ambient sensor calibrated
      - bit3 => analog dimming enabled
      - bit4 => polling disabled
    - zone_flags
      - bit1 => ignore occupancy sensors
      - bit2 => emergency lighting: minimum lighting level enforced at all times
      - bit3 => coordination enabled; lights with 'coordination master' flag trigger all lights in this zone
    - pos_x - X position in facility layout (pixels at base resolution, with origin at top left)
    - pos_y - Y position in facility layout (pixels at base resolution, with origin at top left)
    - engine_status_code - status of the light
      - 0 => NONE
      - 1 => OKAY
      - 100 => COMM_TIMEOUT
      - 200 => UNSYNCED
      - 300 => NOT_IN_MAP
      - 400 => WRONG_NETWORK
      - 500 => DIP_SAFE_MODE
      - 501 => HW_SAFE_MODE

2. Get Zones
  - Get list of all zones in map.
  - USAGE: http GET /api/v1/zones.[xml|json]
  - RETURNS: A formatted list of all zones in the Appliance's map, showing the following fields:
    - id - unique zone ID
    - name - name string
    - description - (optional) descriptive string
    - zone_flags
      - 1 => ignore occupancy sensors
      - 2 => emergency lighting: minimum lighting level enforced at all times
      - 3 => coordination enabled; lights with 'coordination master' flag trigger all lights in this zone

3. Get Rooms
  - Get list of all rooms in map.
  - USAGE: http GET /api/v1/rooms.[xml|json]
  - RETURNS: A formatted list of all rooms in the Appliance's map, showing the following fields:
    - uuid - unique room UUID
    - name - name string
    - description - (optional) descriptive string

4. Get Control Stations
  - Get list of all Control Stations in a map
  - USAGE: api/v1/control_stations.[xml|json]
  - RETURNS: A formatted list of all rooms in the Appliance's map, showing the following fields:
    - created_at - creation date of the control station
    - id - unique control station ID
    - name - name string
    - updated_at -  date the control station was last updated
    - profiles
      - order_offset - explicit ordering as configured by an admin user
      - id - unique profile ID
      - name - name string
      - description - additional text provided by an admin user

  Sample JSON returned for Control stations:
  ```json
  [
    {
      "id": 1,
      "name": "Main Assembly Room",
      "created_at": "2015-10-18T17:52:45-04:00",
      "updated_at": "2015-10-18T17:52:45-04:00",
      "profiles": [
        {
          "order_offset": 0,
          "id": 23,
          "name": "Assembly Area 1",
          "description": "Buckets, heads"
        },
        {
          "order_offset": 1,
          "id": 26,
          "name": "Assembly Area 2",
          "description": "Arms, legs"
        },
        {
          "order_offset": 2,
          "id": 36,
          "name": "Welding",
          "description": ""
        },
        {
          "order_offset": 3,
          "id": 24,
          "name": "Polishing",
          "description": ""
        }
      ]
    }
  ]
  ```

# Retreiving Profile Data
Note: “Operations” role required to access this portion of the LightRules API.

1. Get Profile Index
  - Get a list of all available profiles
  - USAGE: `http GET /api/v1/profiles.[xml|json]`
  - RETURNS: A formatted list of all the profiles on the LRA, showing the following fields:
    - id - unique profile ID
    - name - name string
    - description - (optional) descriptive string
    - Profile Rules - A list of each zone the profile has a rule for, showing the following fields:
      - Zone ID
      - zone name - zone name string
      - active
      - inactive
      - delay
2. Get Profile
  - get details on a single profile
  - USAGE: `http GET /api/v1/profiles/[profile number].[xml|json]`
  - RETURNS: The details of a specific profile. Shows the same data as index, but for a single profile.

# Managing Active Profiles  
Note: “Operations” role required to access this portion of the LightRules API.

1. Get Profile Activation Status
  - Get the state of the Engine's profile activation queue, as a count of fixtures. Fixtures will be added to this queue by a variety of events including scheduled profile changes, manual or programmed profile pushes, or edits to active profiles.
  - NOTE that a progress bar value may be calculated as (completed + failed) / total, but the total may be updated at any time, resulting in non-linear change of this value.

  - USAGE: `http GET /api/v1/profiles/status.[xml|json]`
  - RETURNS: A list containing info on the profile activation queue.
    - serial - Unique queue state identifier. This number is updated on explicit profile pushes, typically when the *total* value is updated.
    - active
      - 0 => Push has completed
      - 1 => push is in progress
    - total - total number of lights the Engine is communicating with (length of the queue at the time *serial* was incremented)
    - completed lights - number of lights that have successfully accepted the push
    - failed lights - lights that have not accepted the push

2. Get Active Profile Index
  - lists active and pending profiles
  - USAGE: `http GET /ap1/v1/active_profiles.[xml|json]` (new; preferred)
    - OR `http GET /api/v1/profiles/active_profiles.[xml|json]` (old; deprecated)
  - RETURNS: A list of many [profile, serial, expiration, schedule, keypad] tuples, one for each active profile. Profiles are listed by order of ascending precedence, from lowest to highest. This means any zone rule toward the beginning of the list is overridden by a rule for the same zone later in the list.
    - profile
      - {all fields seen in profile Index/Show}
    - serial/sequence - unique push identifier, used to cancel the specific push
    - expiration - unix time when the profile will be deactivated; 0 means "does not expire"
    NOTE that the server's time is authoritative. While the server can be configured for
    clock synchronization via NTP in LightRules 2.11+, this is not guaranteed. Since any
    difference between the server's time and the client's can result in a confusing expression of expiration time, we advise you to use the HTTP Date header in the response to get the server's current time. You can calculate the difference between the server's clock and the client's, and adjust all displays of time accordingly.

  Sample JSON response:
  ```json
  [
    {
      "profile":{
        "id":1,
        "name":"Default Profile",
        "description":null
      },
      "serial":0,
      "expiration":0,
      "schedule":{
        "id":1,
        "name":"Default Schedule",
        "create_time":"2015-06-22T10:49:19-07:00",
        "description":null,
        "duration":0,
        "last_date":null,
        "priority":0,
        "profile_id":1,
        "sched_time":946713600000,
        "sched_type":0,
        "start_date":"2015-09-15"
      },
      "keypad":null
    },
    {
      "profile":{
        "id":3,
        "name":"Dock Inspection"
        "description":""
      },
      "serial":53,
      "expiration":1442864899,
      "schedule":null,
      "keypad":null
    }
  ]
  ```
  This response shows 2 active profiles: the Default Profile via the Default Schedule, which will always appear first on the list.  Next is a manual push of the profile called "Dock Inspection," which is set to expire at __2015-09-21 15:48:19 -0400__

3. Activate Profile
  - Push a specified profile
  - USAGE: `http POST /api/v1/active_profiles.[xml|json]?[profile=[ID|name]][&expiry=[]][&duration=[]]`  (new; preferred)
    - OR `http POST /api/v1/profiles/active_profiles.[xml|json]?[profile=[ID|name]][&expiry=[]][&duration=[]]` (old; deprecated)
  - PARAMETERS:
    - profile - id or name of profile to push
    - expiry
      - expiry=[fixed|3] - profile is pushed for DURATION minutes  
      - expiry=[permanent|1] - profile is active until canceled by the user
    - duration - only needed if expiry is fixed
      - (omitted)  - if expiry is fixed and duration is omitted, then duration of 0 is assumed
      - duration=X - number of minutes that profile is active for if expiry is fixed
 - RETURNS: Command and STATUS CODE 200 on Success. Error message and STATUS CODE 400 (Bad Request) on parameter error

4. Cancel Active Profile by serial id
  - Cancel a currently active profile
  - USAGE: `http DELETE /api/v1/active_profiles/[serial id].[xml|json]` (new; preferred)
    - OR `http DELETE /api/v1/profiles/active_profiles/[serial id].[xml|json]`  (old; deprecated)
    - NOTE: Serial ID is unique to each profile push, not a specific profile, and is returned in the Get Active Profile Index request. If the same profile is pushed twice there will be two entries in the active profile index each with different serial ids.
  - RETURNS: Command and STATUS CODE 200 on Success. Error message and STATUS CODE 404 (Bad Request) on Error

5. Cancel Active Profile by profile id
  - Cancel a currently active profile
  - USAGE: `http DELETE /api/v1/active_profiles.[xml|json]&profile=[profile id]`
  - RETURNS: Command and STATUS CODE 200 on Success. Error message and STATUS CODE 404 (Bad Request) on Error

6. Extend Active Profile
  - Extend an active profile to a specified time
  - USAGE: `http PATCH or PUT /api/v1/active_profiles/[serial id].[xml|json]`
    - PARAMS: `expiration=[unixtime]` - new expiration time (must be in the future)
    - NOTE: expiration can be easily calculated from the record in the Active Profile Index, which is seconds from the Unix Epoch.
      so to extend by one hour, add 3600 to the current expiration value
    - NOTE: only the expiration can be changed by this method; sending profile or schedule properties will result in 400 Bad Request.


# Retrieving Usage Data
Note: “Reporting” role required to access this portion of the LightRules API.

LightRules automatically aggregates usage data across multiple levels - per light, per zone, per room, and for a full facility. The report command allows third-party systems to easily query for this aggregated data at any level, for a specified range of dates. All usage data is presented in fifteen-minute intervals.
- USAGE: `http GET /api/v1/report.[xml|json]?[(scope)][&start=YYYY-MM-DD[&end=YYYY-MM-DD]]`
- PARAMETERS:
  - scope
    - (omitted) - return aggregated usage data for full facility
    - room=X - return aggregated usage data for the specified room uuid
    - zone=X - return aggregated usage data for the specified zone id
    - light=X - return usage data for the specified light by serial number
      - NOTE that serial number is a string in hexadecimal (base 16) format (example: light=0011532D)
  - start - First day of data to return; if omitted, defaults to 30 days ago
  - end - Last day of data to return (should be at least start + 1 day); if omitted, defaults to the current day
    - NOTE that an end date without a start date will be ignored.

- RETURNS:

  Each XML or JSON response document will contain two elements at the root.

  1. header: a summary of the effective parameters used for the query
    - timestamp - ISO 8601 timestamp for the completed query
    - start - the first date for which report data is returned
    - end - the last date for which report data is returned

  2. usage_facts: A formatted list of usage data per 15-minute interval, showing the following fields:
    - interval_start - beginning of 15-minute interval, in unixtime
    - active_sec - light active time during this interval, in seconds
    - sensor0_sec - light sensor 0 "on" time during this interval, in seconds (optional external sensors)
    - sensor1_sec - light sensor 1 "on" time during this interval, in seconds (onboard motion sensor)
    - remote_sec - time during which light was active via coordinated control, in seconds
      - NOTE: when using coordinated control, sensor1_sec + remote_sec may be greater than active_sec for any given interval
    - wh_merged - Wh used during this interval

  A parameter error will return a message and a 404 status code

A typical record in JSON looks like this:

```json
{
  "active_sec":9878,
  "fact_count":153,
  "interval_start":1346498100,
  "sensor0_sec":0,
  "sensor1_sec":8028,
  "total_sec":137700,
  "wh_merged":249.725865457411
}
```

This record is for the 15-minute interval starting 2012-09-01 07:15:00 -0400 (2012-09-01 11:15:00 UTC).
During the interval, there were a total of 9878 seconds of active usage for all lights in the report scope.
The total energy used during this interval was 249.725 Watt Hours.

When aggregating usage across multiple lights, we report the product of total lights counted * 900 sec in the total_sec field. For a given reporting scope (entire facility, room, or zone), the total_sec for all records should be constant.  Due to normal delays in data collection, the most recent intervals may have lower numbers. This indicates that not all the usage data have been collected for this interval, and the values should not be considered final.

To calculate Active Time Percentage, use active_sec over total_sec. This is the percentage of time that all lights are in Active state. Note that Inactive state may be a non-zero light level, and even a zero light level will consume a minimal but non-zero power level.

To calculate Occupancy, use sensor1_sec divided by total_sec.

  Note that LightRules has a "first day" setting. This is the first day for which the collected data are considered accurate. The Reporting API will not return data collected earlier than this date. It is possible to determine this date by requesting data for before the known system installation date, and noting the value of 'start' in the response header.  A request with parameter start=2001-01-01 will return data starting at the configured first_day with no performance penalty.
