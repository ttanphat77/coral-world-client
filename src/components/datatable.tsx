import React from 'react';
import {
    Box, Button,
    chakra,
    Flex,
    IconButton,
    Input, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, NumberInputField, NumberInputStepper, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr
} from "@chakra-ui/react";
import {useFilters, usePagination, useSortBy, useTable} from "react-table";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    TriangleDownIcon,
    TriangleUpIcon
} from "@chakra-ui/icons";

export default function ({columns, data, sortBy}: any) {
    const filterTypes = React.useMemo(
        () => ({
            text: (rows: any, id: any, filterValue: any) => {
                return rows.filter((row: any) => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const {
        getTableProps, getTableBodyProps, headerGroups, page, prepareRow,
        canPreviousPage, canNextPage, pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize}
    } =
        useTable({
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: sortBy ? {sortBy} : undefined,
        }, useFilters, useSortBy,  usePagination);

    return (
        <>
            <Table {...getTableProps()}>
                <Thead>
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <Th>
                                    <Box
                                        {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <chakra.span pl='4'>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <TriangleDownIcon aria-label='sorted descending'/>
                                                ) : (
                                                    <TriangleUpIcon aria-label='sorted ascending'/>
                                                )
                                            ) : null}
                                        </chakra.span>
                                    </Box>
                                    <Box>{column.canFilter ? column.render('Filter') : null}</Box>
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row)
                        // @ts-ignore
                        return (
                            <Tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <Td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </Td>
                                ))}
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            <Flex justifyContent="space-between" m={4} alignItems="center">
                <Flex>
                    <Tooltip label="First Page">
                        <IconButton
                            onClick={() => gotoPage(0)}
                            isDisabled={!canPreviousPage}
                            icon={<ArrowLeftIcon h={3} w={3}/>}
                            mr={4}
                            aria-label={''}/>
                    </Tooltip>
                    <Tooltip label="Previous Page">
                        <IconButton
                            onClick={previousPage}
                            isDisabled={!canPreviousPage}
                            icon={<ChevronLeftIcon h={6} w={6}/>}
                            aria-label={''}/>
                    </Tooltip>
                </Flex>

                <Flex alignItems="center">
                    <Text flexShrink="0" mr={8}>
                        Page{" "}
                        <Text fontWeight="bold" as="span">
                            {pageIndex + 1}
                        </Text>{" "}
                        of{" "}
                        <Text fontWeight="bold" as="span">
                            {pageOptions.length}
                        </Text>
                    </Text>
                    <Text flexShrink="0">Go to page:</Text>{" "}
                    <NumberInput
                        ml={2}
                        mr={8}
                        w={28}
                        min={1}
                        max={pageOptions.length}
                        onChange={(value: any) => {
                            const page = value ? (value - 1) : 0;
                            gotoPage(page);
                        }}
                        defaultValue={pageIndex + 1}
                    >
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                    <Select
                        w={32}
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </Select>
                </Flex>

                <Flex>
                    <Tooltip label="Next Page">
                        <IconButton
                            onClick={nextPage}
                            isDisabled={!canNextPage}
                            icon={<ChevronRightIcon h={6} w={6}/>}
                            aria-label={''}/>
                    </Tooltip>
                    <Tooltip label="Last Page">
                        <IconButton
                            onClick={() => gotoPage(pageCount - 1)}
                            isDisabled={!canNextPage}
                            icon={<ArrowRightIcon h={3} w={3}/>}
                            ml={4}
                            aria-label={''}/>
                    </Tooltip>
                </Flex>
            </Flex>
        </>
    )
}

function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter},}: any) {
    const count = preFilteredRows.length

    return (
        <Input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

export function OptionFilter({column: {filterValue, setFilter, preFilteredRows, id},}: any) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options: any = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach((row: any) => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <Select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option: any, i: number) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    )
}

export function SliderColumnFilter({
                                column: { filterValue, setFilter, preFilteredRows, id },
                            }: any) {
    // Calculate the min and max
    // using the preFilteredRows

    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach((row: any) => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <>
            <input
                type="range"
                min={min}
                max={max}
                value={filterValue || min}
                onChange={e => {
                    setFilter(parseInt(e.target.value, 10))
                }}
            />
            <Button onClick={() => setFilter(undefined)} size={'sm'}>Off</Button>
        </>
    )
}

// Define a custom filter filter function!
export function filterGreaterThan(rows: any, id: any, filterValue: any) {
    return rows.filter((row: any) => {
        const rowValue = row.values[id]
        return rowValue >= filterValue
    })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val: any) => typeof val !== 'number'
