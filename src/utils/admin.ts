import { TableColumnProps } from "ant-design-vue";
import merge from "lodash/merge";
import { h } from "vue";
import { AdminApi } from "../api";
import { Schema } from "../store/interface";

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
  return new Promise<{ records: any[] }>((resolve, reject) => {
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

  // 额外的列
  extraColumns?: TableColumnProps[];
  columnFactory: Record<string, TableColumnProps>;
  // 格式列
  columns: TableColumnProps[];
  // 隐藏列
  hideColumns?: string[];
}

export class AdminTable<T> implements AdminTableOptions<T> {
  tableName: string;
  hideColumns: string[];
  columnFactory: Record<string, TableColumnProps>;
  columns: TableColumnProps[] = [];
  extraColumns: TableColumnProps[] = [];
  schemas: Schema[] = [];
  dataSource: T[] = [];
  page: number;
  size: number;
  constructor(options: AdminTableOptions<T>) {
    console.log("options", options);

    const { tableName, columnFactory, hideColumns, extraColumns, page, size } =
      options;
    this.tableName = tableName;
    this.extraColumns = extraColumns || [];
    this.columnFactory = columnFactory;
    this.hideColumns = hideColumns || [];
    this.page = page;
    this.size = size;
  }

  /**
   * 初始化
   */
  async initColumns() {
    this.schemas = await this.getSchema();

    this.columns = this.schemas
      .map((schema) => {
        if (this.hideColumns.find((c) => c === schema.name)) {
          return undefined;
        } else {
          const obj = {
            dataIndex: schema.name,
            title: schema.label,
          };

          return merge(obj, this.columnFactory[schema.name]);
        }
      })
      .filter((c) => !!c) as any[];
    this.columns.push(...this.extraColumns);
  }

  private async getSchema() {
    return await createSchema(this.tableName);
  }

  async update() {
    const { records } = await createDataSource(
      this.tableName,
      this.page,
      this.size
    );
    this.dataSource = records;
  }
}

export function createDefaultColumnFactory(): any {
  const timeColumn = {
    customRender: (opts: any) => new Date(opts.value).toLocaleString("zh-CN"),
    defaultSortOrder: "descend",
    sorter: (a: any, b: any) => a.createTime - b.createTime,
    responsive: ["lg"],
  };
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
    createTime: timeColumn,
    updateTime: timeColumn,
  };
}
