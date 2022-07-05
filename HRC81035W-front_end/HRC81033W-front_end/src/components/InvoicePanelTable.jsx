import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Checkbox,
} from "@material-ui/core";

import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { headCells } from "./headCells";
import "../styles.css";

import InputBase from "@material-ui/core/InputBase";

import DeleteDialogForm from "./DeleteDialogForm";
import AddFormDialog from "./AddFormDialog";
import EditDialogForm from "./EditDialogForm";
import { SERVER_URL } from "../utils/constants";
import AdvanceSearch from "./AdvanceSearch";

const useStyles = makeStyles((theme) => ({
    // root: {
    //     margin: "2rem auto",
    //     width: "80%",
    //     [theme.breakpoints.down("sm")]: {
    //         width: "100%",
    //         marginBottom: "0",
    //     },
    // },
    // paper: {
    //     width: "100%",
    //     marginBottom: theme.spacing(2),
    // },
    table: {
        minWidth: 600,
    },
    Grid: {
        display: "flex",
        flexDirection: "column",
    },
    checkboxbodycell: {
        padding: "2px 10px",
        transform: "scale(0.7)",
        color: theme.palette.primary.main,
    },
    checkboxhead: {
        padding: "3px 10px",
        transform: "scale(0.7)",
        color: theme.palette.primary.main,
    },
    tablecontainer: {
        maxHeight: 370,
        marginBottom: "10px",
    },
    infiniteScrollGrid: {
        paddingLeft: "30px",
        paddingRight: "30px",
    },
    main: {
        // paddingTop: '20px',
        paddingLeft: "30px",
        paddingRight: "30px",
    },
    paper: {
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: "#273D49CC",
    },
    root: {
        "& .MuiTableCell-root": {
            padding: "1px",
            fontSize: "0.60rem",
            borderBottom: "none",
        },
        "& .PrivateSwitchBase-root-18": {
            padding: "1px 1px",
        },
        "& .MuiTableCell-stickyHeader": {
            background: "#283A46",
            fontWeight: "bolder",
            color: "#97A1A9",
            fontSize: "12px",
            // fontSize: "0.5rem",
            borderBottom: "1px solid #283A46",
        },
        "& .MuiTableCell-body": {
            color: "white",
            maxHeight: "5px",
            fontSize: "12px", //edit
        },
        root: {
            "& .MuiFormLabel-root": {
                fontSize: "0.25rem",
                color: "white",
            },
        },
        sizeSmall: {
            height: "3px",
        },
    },

    /* Panel Header */
    header: {
        padding: "30px 30px",
    },
    input: {
        fontSize: "0.6rem",
        marginLeft: theme.spacing(1),
        flex: 1,
    },

    labelroot: {
        fontSize: "0.5rem",
        color: theme.palette.primary,
    },
    searchpaper: {
        backgroundColor: "#fff",
        height: "30px",
        marginLeft: theme.spacing(1),
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 200,
        border: `1px solid ${theme.palette.secondary.main}`,
    },
    primary: {
        color: "white",
    },
    oultined: {
        color: "blue",
    },
}));

export default function InvoicePanelTable() {
    const classes = useStyles();
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(false);
    const [pageCount, setCount] = useState(1);
    const [responseData, setResponseData] = useState([]);
    const [isNext, isNextFunc] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [advanceSearch, setAdvanceSearch] = useState(false);
    const [advanceSearchData, setAdvanceSearchData] = useState();

    const displayData = (e) => {
        axios
            .get(`${SERVER_URL}/send-records?page=${pageCount}`)
            .then(function (response) {
                const rowData = response.data;
                setRowData(rowData);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        if (advanceSearch) {
            console.log(advanceSearchData);
            const { documentId, invoiceId, customerNumber, businessYear } =
                advanceSearchData;
            const config = {
                body: {
                    documentId,
                    invoiceId,
                    customerNumber,
                    businessYear,
                },
            };
            try {
                const fetchData = async () => {
                    const response = await axios.post(
                        `${SERVER_URL}/AdvanceSearchRecord`,
                        config
                    );
                    console.log(response.data);
                    setRowData([...response.data]);
                    setResponseData([...response.data]);
                    // console.log([...response.data]);
                };
                fetchData();
            } catch (error) {
                console.log(error);
            }
        }
        setAdvanceSearch(false);
    }, [advanceSearch]);
    // call the function on component mount
    useEffect(() => {
        displayData();
    }, []);

    // infinite scroll
    const handleLoad = useCallback(() => {
        try {
            const fetchData = async () => {
                const response = await axios.get(
                    `${SERVER_URL}/send-records?page=${pageCount}`
                );
                const uniqueData = response.data.filter(
                    (item, index) =>
                        response.data.findIndex(
                            (t) => t.sl_no === item.sl_no
                        ) === index
                );
                rowData.push(...uniqueData);

                setResponseData([...responseData, ...response.data]);
                isNextFunc(true);
            };
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, [pageCount]);

    function fetchMoreData() {
        setCount(pageCount + 1);
    }

    useEffect(() => {
        handleLoad();
    }, [handleLoad, pageCount]);

    const handleRemove = () => {
        setRemove(!remove);
        handleLoad();
    };

    const handleEdit = () => {
        setEdit(!edit);
        handleLoad();
        setSelected([]);
    };

    // for search operation using debouncing.
    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args);
            }, 1000);
        };
    };
    const handleSearch = (e) => {
        setSearch(e.target.value);
        // console.log(e.target.value);
        try {
            const fetchData = async () => {
                const response = await axios.get(
                    `${SERVER_URL}/SearchRecord?searchKeyword=${e.target.value}`
                );
                console.log(response.data);
                setRowData([...response.data]);
                setResponseData([...response.data]);
                // console.log([...response.data]);
            };
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const optimisedSearch = useCallback(debounce(handleSearch), []);

    // for selecting all checkboxes
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(responseData.map((row) => row.sl_no));
            return;
        }
        setSelected([]);
    };

    // for checkbox selection
    const handleClick = (event, sl_no) => {
        const selectedIndex = selected.indexOf(sl_no);
        // console.log(selectedIndex);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, sl_no);
            // console.log(sl_no)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const isSelected = (sl_no) => selected.indexOf(sl_no) !== -1;

    return (
        <div className={classes.main}>
            <Paper elevation={3} className={classes.paper}>
                {/* function buttons */}
                <Grid xs={12}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-around"
                        className={classes.header}
                        variant="outlined "
                    >
                        <Grid
                            item
                            xs={4}
                            direction="row"
                            style={{ display: "flex" }}
                        >
                            <Button
                                classes={{
                                    containedPrimary: classes.primary,
                                }}
                                style={{
                                    backgroundColor: "#15AEF2",
                                    borderRadius: "4px 0 0 4px",
                                    width: "10vw",
                                }}
                                variant="contained"
                                color={
                                    selected.length > 0
                                        ? "secondary"
                                        : "primary"
                                }
                                size="small"
                            >
                                Predict
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                style={{
                                    borderColor: "#15AEF2",
                                    borderWidth: "1px 0 1px 0",
                                    borderRadius: "0",
                                    width: "10vw",
                                }}
                            >
                                Analytics View
                            </Button>
                            <AdvanceSearch
                                advanceSearch={advanceSearch}
                                setAdvanceSearch={setAdvanceSearch}
                                advanceSearchData={advanceSearchData}
                                setAdvanceSearchData={setAdvanceSearchData}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            direction="row"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Paper
                                component="form"
                                className={classes.searchpaper}
                                alignitems="center"
                            >
                                <InputBase
                                    className={classes.input}
                                    placeholder="Search Customer Id"
                                    inputProps={{
                                        "aria-label":
                                            "Search by Invoice Number",
                                        size: "small",
                                    }}
                                    onChange={optimisedSearch}
                                />
                            </Paper>
                        </Grid>
                        <Grid
                            container
                            item
                            xs={5}
                            justifyContent="space-between"
                        >
                            <AddFormDialog />
                            <EditDialogForm
                                selected={selected}
                                onChange={handleEdit}
                            />
                            <DeleteDialogForm
                                selected={selected}
                                remove={remove}
                                onChange={handleRemove}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Data table */}

                <Grid className={classes.infiniteScrollGrid} xs={12}>
                    <InfiniteScroll
                        dataLength={rowData.length}
                        next={fetchMoreData}
                        hasMore={true}
                    >
                        <TableContainer
                            className={classes.tablecontainer}
                            id="scrollableDiv"
                            style={{
                                height: window.innerHeight - 230,
                                width: window.innerWidth - 80,
                                overflow: "scroll",
                                overflowX: "hidden",
                            }}
                        >
                            <Table
                                className={classes.table + " " + classes.root}
                                stickyHeader
                                aria-label="sticky table"
                                size={"small"}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox
                                                className={classes.checkboxhead}
                                                onChange={handleSelectAllClick}
                                                inputProps={{
                                                    "aria-label":
                                                        "select all invoice",
                                                }}
                                            />
                                        </TableCell>

                                        {headCells.map((headCell, index) => (
                                            <TableCell
                                                key={headCell.id}
                                                align="center"
                                                padding={
                                                    headCell.disablePadding
                                                        ? "none"
                                                        : "normal"
                                                }
                                            >
                                                {headCell.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rowData.map((row, index) => {
                                        const isItemSelected = isSelected(
                                            row.sl_no
                                        );
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                key={row.sl_no}
                                                style={
                                                    isItemSelected
                                                        ? {
                                                              background:
                                                                  "#2A5368",
                                                          }
                                                        : index % 2
                                                        ? {
                                                              background:
                                                                  "#283A46",
                                                          }
                                                        : {
                                                              background:
                                                                  "#273D49CC",
                                                          }
                                                }
                                                onClick={(event) =>
                                                    handleClick(
                                                        event,
                                                        row.sl_no
                                                    )
                                                }
                                                aria-checked={isItemSelected}
                                                tabIndex={-1} // to set table header tabIndex as -1
                                                selected={isItemSelected}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        className={
                                                            classes.checkboxbodycell
                                                        }
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            "aria-labelledby":
                                                                labelId,
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Data insertion inside the row */}
                                                <TableCell align="center">
                                                    {row.sl_no}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.business_code}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.cust_number}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.clear_date}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.buisness_year}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.doc_id}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.posting_date}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.document_create_date}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.due_in_date}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.invoice_currency}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.document_type}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.posting_id}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.total_open_amount}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.baseline_create_date}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.cust_payment_terms}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.invoice_id}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            {/* <div style={{ textAlign: "right", color: "white" }}>
                                <ArrowLeftIcon />
                                <ArrowRightIcon />
                            </div> */}
                        </TableContainer>
                    </InfiniteScroll>
                </Grid>
            </Paper>
        </div>
    );
}
