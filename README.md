Command line tool for querying logs made with `timequerylog` module.

`npm i -g tql-cli`

# Usage

Show 'events' from last 30 minutes. Output is JSON.

```shell
tql event
```

Type 'errors' from start time with data directory 'datalog'.

```shell
tql -d datalog errors -s 05-01-2015
```

Type 'event' between start and end time.

```shell
tql event -s "2008-09-15T15:53:00+00:00" -e "2008-09-15T16:53:00+00:00"
```

Match function.

```shell
tql event -s 01-01-2010 -m "return r.x>r.y;"
```

