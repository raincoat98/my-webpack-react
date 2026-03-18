import React, { useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

const DEFAULT_COL_DEF = {
  resizable: true,
  sortable: true,
  floatingFilter: true,
};

/**
 * server.getData(request) 를 구현해서 넘기면 됩니다.
 *
 * @example
 * const server = {
 *   getData: (request) => {
 *     const rows = allData.slice(request.startRow, request.endRow);
 *     return { success: true, rows, lastRow: ... };
 *   },
 * };
 * <ServerSideGrid server={server} columnDefs={columnDefs} />
 *
 * @param {object}    server                  - { getData(request): { success, rows, lastRow } }
 * @param {object[]}  columnDefs              - 컬럼 정의
 * @param {object}    [defaultColDef]         - defaultColDef 오버라이드 (기본값과 병합)
 * @param {string}    [theme='ag-theme-balham'] - 적용할 AG Grid 테마 클래스명
 * @param {string}    [height='480px']        - 그리드 높이
 * @param {number}    [cacheBlockSize=50]     - 한 번에 요청할 행 수
 * @param {boolean}   [pagination=true]
 * @param {number}    [paginationPageSize=20]
 * @param {object}    [rowSelection]          - 행 선택 설정 (기본: singleRow)
 * @param {...*}      rest                    - AgGridReact에 그대로 전달되는 나머지 props (sideBar 등)
 */
function ServerSideGrid({
  server,
  columnDefs,
  defaultColDef,
  theme = 'ag-theme-balham',
  height = '480px',
  cacheBlockSize = 50,
  pagination = true,
  paginationPageSize = 20,
  rowSelection = { mode: 'singleRow' },
  ...rest
}) {
  const mergedColDef = useMemo(
    () => ({ ...DEFAULT_COL_DEF, ...defaultColDef }),
    [defaultColDef],
  );

  const onGridReady = useCallback((params) => {
    const datasource = {
      getRows: async (rowParams) => {
        console.log('[Datasource] rows requested:', rowParams.request);
        try {
          const response = await server.getData(rowParams.request);
          if (response.success) {
            rowParams.success({ rowData: response.rows, rowCount: response.lastRow });
          } else {
            rowParams.fail();
          }
        } catch {
          rowParams.fail();
        }
      },
    };
    params.api.setGridOption('serverSideDatasource', datasource);
  }, [server]);

  return (
    <div style={{ width: '100%', height }}>
      <div className={theme} style={{ width: '100%', height: '100%' }}>
        <AgGridReact
          rowModelType="serverSide"
          rowBuffer={0}
          columnDefs={columnDefs}
          defaultColDef={mergedColDef}
          cacheBlockSize={cacheBlockSize}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          rowSelection={rowSelection}
          onGridReady={onGridReady}
          {...rest}
        />
      </div>
    </div>
  );
}

export default ServerSideGrid;
