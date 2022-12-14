import { TableColumnProps } from "ant-design-vue";
import merge from "lodash/merge";
import { h } from "vue";
import { AdminApi } from "../api";
import { Page, Schema } from "../store/interface";

/**
 * 根据后端的数据库表名，利用反射自动获取对象中的各个字段信息，并返回成 ant design table 所需的 colum 数据列
 * @param renders
 * @returns
 */
export function createSchema(tableName: string) {
  return new Promise<any[]>((resolve, reject) => {
    AdminApi.schema({
      tableName,
    }).then(({ data: { data } }) => {
      resolve(data);
    });
  });
}

export async function createDataSource(
  tableName: string,
  page: number,
  size: number
) {
  return new Promise<Page<any>>((resolve, reject) => {
    AdminApi.data({ tableName, page, size }).then(({ data: { data } }) => {
      resolve(data);
    });
  });
}

export interface AdminTableOptions<T> {
  tableName: string;
  dataSource: T[];
  page: number;
  size: number;
  schemas: Schema[];
  total?: number;
  // 额外的列
  extraColumns?: TableColumnProps[];
  columnFactory: Record<string, TableColumnProps>;
  // 格式列
  columns: TableColumnProps[];
  // 隐藏列
  hideColumns?: string[];
  columnsFilter?: (col: TableColumnProps, schemas: Schema[]) => boolean;
  loading?: boolean;
}

export class AdminTable<T> implements AdminTableOptions<T> {
  tableName: string;
  hideColumns: string[];
  columnFactory: Record<string, TableColumnProps>;
  columns: TableColumnProps[] = [];
  extraColumns: TableColumnProps[] = [];
  schemas: Schema[] = [];

  dataSource: T[] = [];
  total: number = 10;
  page: number = 1;
  size: number = 10;
  columnsFilter?: (col: TableColumnProps, schemas: Schema[]) => boolean;
  // 是否正在加载
  loading: boolean = false;

  constructor(options: AdminTableOptions<T>) {
    const {
      tableName,
      columnFactory,
      hideColumns,
      extraColumns,
      page,
      size,
      total,
      columnsFilter,
    } = options;

    this.tableName = tableName;
    this.extraColumns = extraColumns || [];
    this.columnFactory = columnFactory;
    this.hideColumns = hideColumns || [];
    this.page = page || this.page;
    this.size = size || this.size;
    this.total = total || this.total;
    this.columnsFilter = columnsFilter;
  }

  /**
   * 初始化
   */
  async init() {
    this.loading = true;

    // 获取数据映射表
    this.schemas = await this.getSchema();

    // 从 schema 获取数据列
    this.columns = this.schemas
      .map((schema) => {
        if (this.hideColumns.find((c) => c === schema.name)) {
          return undefined;
        } else {
          const obj = {
            dataIndex: schema.name,
            title: schema.label,
          };

          // 合并数据列
          return merge(obj, this.columnFactory[schema.name]);
        }
      })
      .filter((c) => !!c) as any[];

    // 过滤额外列
    this.columns = this.columns.filter((c) =>
      this.columnsFilter ? this.columnsFilter(c, this.schemas) : true
    );
    // 增加额外列
    this.columns = this.columns.concat(
      ...this.extraColumns.map((extra) =>
        extra.dataIndex || extra.key
          ? merge(
              extra,
              this.columnFactory[(extra.dataIndex || extra.key) as any]
            )
          : extra
      )
    );

    // 降序排序数据列
    // @ts-ignore
    this.columns = this.columns.sort((a, b) => (b.level || 0) - (a.level || 0));

    if (this.dataSource.length === 0) {
      await this.update();
    }

    this.loading = false;
  }

  private async getSchema() {
    return await createSchema(this.tableName);
  }

  async update() {
    this.loading = true;
    const { records, total } = await createDataSource(
      this.tableName,
      this.page,
      this.size
    );
    this.dataSource = records;
    this.total = total;

    this.loading = false;
  }
}

export function createDefaultColumnFactory(): any {
  return {
    id: {
      // 响应式
      responsive: ["lg"],
    },
    deleted: {
      responsive: ["lg"],
    },
    version: {
      responsive: ["lg"],
    },
    createTime: {
      customRender: (opts: any) => new Date(opts.value).toLocaleString("zh-CN"),
      defaultSortOrder: "descend",
      sorter: (a: any, b: any) => a.createTime - b.createTime,
      responsive: ["lg"],
    },
    updateTime: {
      customRender: (opts: any) => new Date(opts.value).toLocaleString("zh-CN"),
      defaultSortOrder: "descend",
      sorter: (a: any, b: any) => a.updateTime - b.updateTime,
      responsive: ["lg"],
    },
  };
}
