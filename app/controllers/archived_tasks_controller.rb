class ArchivedTasksController < ApplicationController
  skip_before_action :verify_authenticity_token
  include ActionView::Helpers::DateHelper

  def index
    respond_to :json, :html
    begin
      board = current_user.boards.find(params[:board_id])
      render :json => {
        :archivedTasks => board.archived_tasks.map { |task| {
          :title => task.title,
          :id => task.id,
          :list => {
            :title => task.list.title,
            :id => task.list.id
          },
          :archivedBy => task.archived_by.username,
          :archivedAt => task.updated_at
        }}
      }, :status => 200
    rescue
      render :json => {
        :error => "Board cannot be found."
      }, :status => 404
    end
  end

  def show
    respond_to :json, :html
    begin
      board = current_user.boards.find(params[:id])
      render :json => {
        :title => board.title,
        :tasks => board.lists.map {|list| {
          :title => list.title,
          :tasks => list.tasks,
          :id => list.id,
        }}
      }, :status => 200
    rescue
      render :json => {
        :error => "List cannot be found."
      }, :status => 404
    end
  end

  def create
    respond_to :json, :html
    task = Task.find(params[:id])
    user_boards = current_user.boards
    if (user_boards.include? task.board)
      archived_task = ArchivedTask.new()
      archived_task.list = task.list
      archived_task.title = task.title
      archived_task.board = task.board
      archived_task.archived_by = current_user
      original_id = task.id
      task.destroy
      if archived_task.save
        render :json => {
          :archivedTask => {
            originalId: original_id,
            listId: archived_task.list.id
          }
        }, :status => 200
      else render :json => {
        :error => archived_task.errors
      }, :status => 404
      end
    end
  end

  private
    def task_params
      params.require(:task).permit(:title)
    end
end
