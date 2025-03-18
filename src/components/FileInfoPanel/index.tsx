import * as React from "react";
import classNames from "classnames";
import {observer} from "mobx-react";

import {AppStore} from "stores";

import "./index.scss";

interface FileInfoPanelState {
    selectedTab: string | null;
    selectedHdu: string;
}

@observer
export default class FileInfoPanel extends React.Component<{}, FileInfoPanelState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "file",
            selectedHdu: ""
        };
    }

    onLoadFile = () => {
        const store = AppStore.Instance;
        store.openFile("", "", this.state.selectedHdu ? this.state.selectedHdu : "", null, true, store.fileParams.isPersonalData, store.fileParams.id, store.fileParams.level);
    };

    render() {
        const store = AppStore.Instance;
        const isFileInfoExtended = Object.keys(store.fileResponse?.fileInfoExtended || {}).length > 1;
        const options = isFileInfoExtended
            ? Object.keys(store.fileResponse?.fileInfoExtended || {})
                  .map(key => {
                      const value = store.fileResponse?.fileInfoExtended[key];
                      let name = value.computedEntries.find(j => j.name === "Extension name");
                      let hdu = value.computedEntries.find(j => j.name === "HDU");
                      if (name && hdu) {
                          return {name: name.value, hdu: hdu.value};
                      }
                      return null;
                  })
                  .filter(Boolean)
            : null;

        const data = Object.keys(store.fileResponse?.fileInfoExtended || {}).length > 0 ? store.fileResponse?.fileInfoExtended[this.state.selectedHdu || Object.keys(store.fileResponse?.fileInfoExtended)[0]] : {};
        const disabled = data ? Object.keys(data).length === 0 : true;
        const hideLoadButton = store.fileParams && +store.fileParams.level === 2;
        return (
            <div className={`file-info-panel ${hideLoadButton ? "file-info-panel-full" : ""}`}>
                <div className="file-info-panel-title">
                    <div className="file-info-panel-left">
                        <div
                            className={classNames("file-info-panel-title-item", {
                                "file-info-panel-title-item-active": this.state.selectedTab === "file"
                            })}
                            onClick={() => {
                                this.setState({
                                    selectedTab: "file"
                                });
                            }}
                        >
                            文件信息
                        </div>
                        <div
                            className={classNames("file-info-panel-title-item", {
                                "file-info-panel-title-item-active": this.state.selectedTab === "header"
                            })}
                            onClick={() => {
                                this.setState({
                                    selectedTab: "header"
                                });
                            }}
                        >
                            Header信息
                        </div>
                    </div>
                    {options && (
                        <div className="file-info-panel-right">
                            HDU:&nbsp;&nbsp;
                            <select
                                value={this.state.selectedHdu}
                                onChange={e => {
                                    console.log("ee", e, e.target.value);
                                    this.setState({
                                        selectedHdu: e.target.value
                                    });
                                }}
                            >
                                {options.map((i, index) => (
                                    <option value={i.hdu}>
                                        {i.hdu}:{i.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="file-info-panel-content">
                    {this.state.selectedTab === "file" &&
                        data?.computedEntries?.map(i => {
                            return (
                                <div className="file-info-item">
                                    <div className="file-info-item-label">{i.name}</div>
                                    <div className="file-info-item-value">= {i.value}</div>
                                    <div className="file-info-item-comment"></div>
                                </div>
                            );
                        })}

                    {this.state.selectedTab === "header" &&
                        data?.headerEntries?.map(i => {
                            return (
                                <div className="file-info-item">
                                    <div className="file-info-item-label">{i.name}</div>
                                    {i.value && <div className="file-info-item-value">= {i.value}</div>}
                                    {i.comment && <div className="file-info-item-comment">/ {i.comment}</div>}
                                </div>
                            );
                        })}
                </div>
                {!hideLoadButton && (
                    <div className="file-info-panel-bottom">
                        <div className={`file-info-button ${disabled ? "file-info-button-disabled" : ""}`} onClick={this.onLoadFile}>
                            加载
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
