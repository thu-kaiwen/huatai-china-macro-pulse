import { Component, type ErrorInfo, type ReactNode } from "react";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionId?: string;
  sectionName: string;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.MODE !== "test") {
      console.error(`[中国宏观脉搏] ${this.props.sectionName}渲染失败`, error, info);
    }
  }

  render() {
    const content = this.state.hasError ? (
      <div
        aria-label={`${this.props.sectionName}数据暂不可用`}
        className="section-error-card"
        role="alert"
      >
        <h2>{this.props.sectionName}数据暂不可用</h2>
        <p>该模块暂时无法显示，请稍后重试；其他章节仍可继续使用。</p>
      </div>
    ) : this.props.children;

    if (this.props.sectionId) {
      return (
        <section className="section-boundary" id={this.props.sectionId}>
          {content}
        </section>
      );
    }

    if (this.state.hasError) {
      return content;
    }

    return content;
  }
}
