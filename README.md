Command line tool for querying logs made with `timequerylog` module.

`npm i -g tql-cli`

# Usage

Show this readme in terminal.

```shell
tql --help
```

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

Glob match type.

```shell
tql event -s 01-01-2010 -u "error*"
```

Sort results after glob match

```shell
tql event -s 01-01-2010 -u "error*" -r "return a.id < b.id ? 1 : -1"
```

Glob match has optional map function.
```shell
tql event -s 01-01-2010 -u "error*" -a "return r.message"
```

Show last recorded data.

```shell
tql event -l "trade"
```

